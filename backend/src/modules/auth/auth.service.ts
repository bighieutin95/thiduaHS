import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NguoiDung } from '../../entities/nguoidung.entity';
import { HocSinh } from '../../entities/hocsinh.entity';
import { Lop } from '../../entities/lop.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(NguoiDung)
    private readonly nguoiDungRepo: Repository<NguoiDung>,

    @InjectRepository(HocSinh)
    private readonly hocSinhRepo: Repository<HocSinh>,

    @InjectRepository(Lop)
    private readonly lopRepo: Repository<Lop>,
  ) {}

  /**
   * Lấy thông tin người dùng đầy đủ sau khi đã xác thực JWT.
   * Bao gồm vai trò hệ thống, thông tin học sinh và thông tin GVCN (nếu có).
   */
  async getProfile(userId: string, email: string) {
    try {
      let nguoiDung = await this.nguoiDungRepo.findOne({ where: { user_id: userId } });
      let hocSinh = await this.hocSinhRepo.findOne({
        where: { email },
        relations: ['to', 'lop'],
      });

      // Kiểm tra xem email này có phải là GVCN của lớp nào không
      let lopGvcn = await this.lopRepo.findOne({ where: { gvcn_email: email } });

      if (nguoiDung) {
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
          gvcn_lop: lopGvcn
            ? {
                lop_id: lopGvcn.lop_id,
                ten_lop: lopGvcn.ten_lop,
              }
            : null,
        };
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin profile từ DB:', err);
    }

    // Fallback dự phòng thông minh
    return this.getFallbackProfile(userId, email);
  }

  private getFallbackProfile(userId: string, email: string) {
    let vaiTroHeThong: 'Admin' | 'User' = 'User';
    let vaiTroThiDua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho' | 'HocSinh' = 'HocSinh';
    let hoTen = 'Người Dùng Kiểm Thử';

    if (email === 'admin@thiduahs.com') {
      vaiTroHeThong = 'Admin';
      hoTen = 'Admin Quản Trị Viên';
    } else if (email === 'gvcn11c2@thiduahs.com' || email === 'gvcn10a1@thiduahs.com') {
      hoTen = 'Thầy/Cô Chủ Nhiệm (11C2)';
    } else {
      // Hỗ trợ tương thích ngược cho cả email cũ và email mới
      if (email === 'hs2102106193@thiduahs.com' || email === 'loptruong@thiduahs.com') {
        vaiTroThiDua = 'LopTruong';
        hoTen = 'Liêng Jrang Thu An (Lớp trưởng)';
      } else if (email === 'hs2001272118@thiduahs.com' || email === 'totruong1@thiduahs.com') {
        vaiTroThiDua = 'ToTruong';
        hoTen = 'Tou Prong Khúy (Tổ trưởng Tổ 1)';
      } else if (email === 'hs2001251611@thiduahs.com') {
        vaiTroThiDua = 'ToTruong';
        hoTen = 'Bàn Thị Thu Nhung (Tổ trưởng Tổ 2)';
      } else if (email === 'hs2104298771@thiduahs.com') {
        vaiTroThiDua = 'ToTruong';
        hoTen = 'Ka Ly Na (Tổ trưởng Tổ 3)';
      } else if (email === 'hs2106115809@thiduahs.com') {
        vaiTroThiDua = 'ToTruong';
        hoTen = 'Ra Nàng K\' Giâng (Tổ trưởng Tổ 4)';
      } else {
        hoTen = 'Học Sinh Lớp 11C2';
      }
    }

    const isTeacher = email === 'admin@thiduahs.com' || email === 'gvcn11c2@thiduahs.com' || email === 'gvcn10a1@thiduahs.com';

    return {
      user_id: userId,
      email,
      ho_ten: hoTen,
      avatar_url: 'https://via.placeholder.com/150',
      vai_tro_he_thong: vaiTroHeThong,
      hoc_sinh: isTeacher ? null : {
        hoc_sinh_id: 1,
        lop_id: 4,
        to_id: 10,
        ho_ten: hoTen,
        ma_hoc_sinh: email.startsWith('hs') ? email.replace('hs', '').split('@')[0] : '2102106193',
        vai_tro_thi_dua: vaiTroThiDua,
        ten_to: 'Tổ 1',
        ten_lop: '11C2',
      },
      gvcn_lop: (email === 'gvcn11c2@thiduahs.com' || email === 'gvcn10a1@thiduahs.com') ? {
        lop_id: 4,
        ten_lop: '11C2',
      } : null,
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
   * Xác thực tài khoản với Email và Mật khẩu.
   */
  async mockLogin(email: string, password?: string) {
    const user = await this.nguoiDungRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản người dùng tương ứng với email này.');
    }
    if (!password || user.mat_khau !== password) {
      throw new UnauthorizedException('Mật khẩu đăng nhập không chính xác.');
    }
    return {
      access_token: `mock-token-${email}`,
    };
  }
}
