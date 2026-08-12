import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhanQuyen } from '../../entities/phanquyen.entity';

@Injectable()
export class PhanQuyenService {
  constructor(
    @InjectRepository(PhanQuyen) private phanQuyenRepo: Repository<PhanQuyen>,
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
}
