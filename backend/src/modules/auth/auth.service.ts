import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NguoiDung } from '../../entities/nguoidung.entity';
import { HocSinh } from '../../entities/hocsinh.entity';
import { Lop } from '../../entities/lop.entity';
import { To } from '../../entities/to.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(NguoiDung)
    private readonly nguoiDungRepo: Repository<NguoiDung>,

    @InjectRepository(HocSinh)
    private readonly hocSinhRepo: Repository<HocSinh>,
  ) {}

  /**
   * Lấy thông tin người dùng đầy đủ sau khi đã xác thực JWT.
   * Bao gồm vai trò hệ thống và thông tin học sinh (nếu có).
   */
  async getProfile(userId: string, email: string) {
    // Tìm hoặc tạo mới bản ghi người dùng trong td_nguoidung
    let nguoiDung = await this.nguoiDungRepo.findOne({ where: { user_id: userId } });
    if (!nguoiDung) {
      throw new NotFoundException(`Tài khoản chưa được kích hoạt trong hệ thống. Vui lòng liên hệ Admin.`);
    }

    // Tìm thông tin học sinh trong td_hocsinh theo email (nếu có)
    const hocSinh = await this.hocSinhRepo.findOne({
      where: { email },
      relations: ['to', 'lop'],
    });

    return {
      user_id: nguoiDung.user_id,
      email: nguoiDung.email,
      ho_ten: nguoiDung.ho_ten,
      avatar_url: nguoiDung.avatar_url,
      vai_tro_he_thong: nguoiDung.vai_tro_he_thong,
      hoc_sinh: hocSinh
        ? {
            hoc_sinh_id: hocSinh.hoc_sinh_id,
            lop_id: hocSinh.lop_id,
            to_id: hocSinh.to_id,
            ho_ten: hocSinh.ho_ten,
            ma_hoc_sinh: hocSinh.ma_hoc_sinh,
            vai_tro_thi_dua: hocSinh.vai_tro_thi_dua,
            ten_to: hocSinh.to?.ten_to || null,
            ten_lop: hocSinh.lop?.ten_lop || null,
          }
        : null,
    };
  }

  /**
   * Cập nhật vai trò hệ thống cho người dùng (Admin only).
   */
  async setVaiTroHeThong(userId: string, vaiTro: 'Admin' | 'User') {
    await this.nguoiDungRepo.update({ user_id: userId }, { vai_tro_he_thong: vaiTro });
    return { message: `Đã cập nhật vai trò hệ thống thành ${vaiTro}` };
  }

  /**
   * Tạo token giả lập và tự động scaffold dữ liệu kiểm thử nếu DB chưa có
   */
  async mockLogin(email: string) {
    const getMockUuid = (e: string) => {
      switch (e) {
        case 'admin@thiduahs.com': return '00000000-0000-4000-a000-000000000001';
        case 'loptruong@thiduahs.com': return '00000000-0000-4000-a000-000000000002';
        case 'totruong1@thiduahs.com': return '00000000-0000-4000-a000-000000000003';
        case 'hocsinh1@thiduahs.com': return '00000000-0000-4000-a000-000000000004';
        default: return '11111111-1111-4111-a111-111111111111';
      }
    };
    const userId = getMockUuid(email);

    // 1. Tạo hoặc lấy tài khoản hệ thống
    let user = await this.nguoiDungRepo.findOne({ where: { user_id: userId } });
    if (!user) {
      const vaiTroHeThong = email === 'admin@thiduahs.com' ? 'Admin' : 'User';
      const hoTen = email === 'admin@thiduahs.com' ? 'Admin Kiểm Thử' : email.split('@')[0].toUpperCase();
      user = await this.nguoiDungRepo.save({
        user_id: userId,
        email,
        ho_ten: hoTen,
        vai_tro_he_thong: vaiTroHeThong,
      });
    }

    // 2. Scaffold dữ liệu trường lớp học kỳ nếu là học sinh
    if (email !== 'admin@thiduahs.com') {
      const existingHocSinh = await this.hocSinhRepo.findOne({ where: { email } });
      if (!existingHocSinh) {
        // Tự động lấy/tạo Niên học
        let nienHocId = 1;
        const nienHoc = await this.nguoiDungRepo.query("SELECT nien_hoc_id FROM td_nienhoc LIMIT 1");
        if (nienHoc.length === 0) {
          const res = await this.nguoiDungRepo.query(
            "INSERT INTO td_nienhoc (ten_nien_hoc, ngay_bat_dau, ngay_ket_thuc, trang_thai) VALUES ('2026-2027', '2026-09-05', '2027-05-30', true) RETURNING nien_hoc_id"
          );
          nienHocId = res[0].nien_hoc_id;
        } else {
          nienHocId = nienHoc[0].nien_hoc_id;
        }

        // Tự động lấy/tạo Học kỳ
        const hocKy = await this.nguoiDungRepo.query("SELECT hoc_ky_id FROM td_hocky LIMIT 1");
        if (hocKy.length === 0) {
          await this.nguoiDungRepo.query(
            `INSERT INTO td_hocky (nien_hoc_id, ten_hoc_ky, trang_thai) VALUES (${nienHocId}, 'Học kỳ 1', true)`
          );
        }

        // Tự động lấy/tạo Lớp học
        let lopId = 1;
        const lop = await this.nguoiDungRepo.query("SELECT lop_id FROM td_lop LIMIT 1");
        if (lop.length === 0) {
          const res = await this.nguoiDungRepo.query(
            `INSERT INTO td_lop (nien_hoc_id, ten_lop, khoi, gvcn_email) VALUES (${nienHocId}, '10A1', 10, 'gvcn10a1@thiduahs.com') RETURNING lop_id`
          );
          lopId = res[0].lop_id;
        } else {
          lopId = lop[0].lop_id;
        }

        // Tự động lấy/tạo Tổ
        let toId = 1;
        const to = await this.nguoiDungRepo.query("SELECT to_id FROM td_to LIMIT 1");
        if (to.length === 0) {
          const res = await this.nguoiDungRepo.query(
            `INSERT INTO td_to (lop_id, ten_to) VALUES (${lopId}, 'Tổ 1') RETURNING to_id`
          );
          toId = res[0].to_id;
        } else {
          toId = to[0].to_id;
        }

        // Xác định vai trò thi đua tương ứng
        let vaiTroThiDua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho' | 'HocSinh' = 'HocSinh';
        let hoTen = 'Học Sinh Demo';
        let maHocSinh = 'HS001';

        if (email === 'loptruong@thiduahs.com') {
          vaiTroThiDua = 'LopTruong';
          hoTen = 'Lớp Trưởng Demo';
          maHocSinh = 'HS002';
        } else if (email === 'totruong1@thiduahs.com') {
          vaiTroThiDua = 'ToTruong';
          hoTen = 'Tổ Trưởng Demo';
          maHocSinh = 'HS003';
        }

        // Thêm học sinh
        await this.hocSinhRepo.save({
          lop_id: lopId,
          to_id: toId,
          ho_ten: hoTen,
          email,
          ma_hoc_sinh: maHocSinh,
          vai_tro_thi_dua: vaiTroThiDua,
        });

        // Thêm phân quyền mặc định của lớp học
        const pq = await this.nguoiDungRepo.query(`SELECT phan_quyen_id FROM td_phanquyen WHERE lop_id = ${lopId}`);
        if (pq.length === 0) {
          await this.nguoiDungRepo.query(`
            INSERT INTO td_phanquyen (lop_id, vai_tro_thi_dua, duoc_cham_to_vien, duoc_cham_to_truong, duoc_cham_ngoai_to, duoc_duyet_huy_diem) VALUES
            (${lopId}, 'LopTruong', true, true, true, true),
            (${lopId}, 'LopPho', true, true, true, false),
            (${lopId}, 'ToTruong', true, false, false, false),
            (${lopId}, 'ToPho', true, false, false, false)
          `);
        }
      }
    }

    return {
      access_token: `mock-token-${email}`,
    };
  }
}
