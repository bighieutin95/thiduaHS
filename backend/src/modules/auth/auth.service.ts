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
      relations: ['to', 'to.lop'],
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
}
