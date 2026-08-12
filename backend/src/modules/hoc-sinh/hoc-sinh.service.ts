import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HocSinh } from '../../entities/hocsinh.entity';

@Injectable()
export class HocSinhService {
  constructor(
    @InjectRepository(HocSinh) private hocSinhRepo: Repository<HocSinh>,
  ) {}

  /** Import danh sách học sinh hàng loạt */
  async importList(lopId: number, list: Partial<HocSinh>[]) {
    const entities = list.map((hs) => this.hocSinhRepo.create({ ...hs, lop_id: lopId }));
    return this.hocSinhRepo.save(entities);
  }

  /** Cập nhật vai trò thi đua của học sinh */
  async updateVaiTro(hocSinhId: number, vaiTro: HocSinh['vai_tro_thi_dua']) {
    await this.hocSinhRepo.update({ hoc_sinh_id: hocSinhId }, { vai_tro_thi_dua: vaiTro });
    return { message: 'Cập nhật vai trò thành công' };
  }
}
