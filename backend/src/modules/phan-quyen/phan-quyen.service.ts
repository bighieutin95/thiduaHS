import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhanQuyen } from '../../entities/phanquyen.entity';
import { NguoiDung } from '../../entities/nguoidung.entity';

@Injectable()
export class PhanQuyenService {
  constructor(
    @InjectRepository(PhanQuyen) private readonly phanQuyenRepo: Repository<PhanQuyen>,
    @InjectRepository(NguoiDung) private readonly nguoiDungRepo: Repository<NguoiDung>,
  ) {}

  /** Lấy cấu hình phân quyền của lớp học */
  findByLop(lopId: number) {
    return this.phanQuyenRepo.find({ where: { lop_id: lopId } });
  }

  /** Cập nhật cấu hình phân quyền */
  async updateByLop(lopId: number, configs: Partial<PhanQuyen>[]) {
    for (const cfg of configs) {
      await this.phanQuyenRepo.upsert(
        { ...cfg, lop_id: lopId },
        ['lop_id', 'vai_tro_thi_dua']
      );
    }
    return { message: 'Cập nhật phân quyền thành công' };
  }

  /** Lấy danh sách toàn bộ người dùng hệ thống */
  async getAllUsers() {
    return this.nguoiDungRepo.find({ order: { ngay_tao: 'ASC' } });
  }

  /** Admin cấp username, mật khẩu và quyền cho người dùng */
  async updateUser(body: { email: string; username?: string; mat_khau?: string; vai_tro_he_thong?: string; ho_ten?: string }) {
    let user = await this.nguoiDungRepo.findOne({ where: { email: body.email } });
    if (!user) {
      user = this.nguoiDungRepo.create({
        user_id: require('crypto').randomUUID(),
        email: body.email,
        username: body.username || body.email.split('@')[0],
        mat_khau: body.mat_khau || 'Thidua@2026',
        ho_ten: body.ho_ten || body.email,
        vai_tro_he_thong: (body.vai_tro_he_thong === 'Admin' ? 'Admin' : 'User') as any,
      });
    } else {
      if (body.username) user.username = body.username;
      if (body.mat_khau) user.mat_khau = body.mat_khau;
      if (body.ho_ten) user.ho_ten = body.ho_ten;
      if (body.vai_tro_he_thong) user.vai_tro_he_thong = (body.vai_tro_he_thong === 'Admin' ? 'Admin' : 'User') as any;
    }
    await this.nguoiDungRepo.save(user);
    return { message: 'Cập nhật tài khoản người dùng thành công!', user };
  }

  /** Admin thay đổi mật khẩu của một tài khoản */
  async updatePassword(email: string, matKhau: string) {
    const user = await this.nguoiDungRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản người dùng tương ứng với email này.');
    }
    user.mat_khau = matKhau;
    await this.nguoiDungRepo.save(user);
    return { message: 'Thay đổi mật khẩu thành công!' };
  }
}
