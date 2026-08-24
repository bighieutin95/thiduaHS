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
