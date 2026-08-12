import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DanhMucTieuChi } from '../../entities/danhmuc-tieuchi.entity';

@Injectable()
export class TieuChiService {
  constructor(
    @InjectRepository(DanhMucTieuChi) private tieuChiRepo: Repository<DanhMucTieuChi>,
  ) {}

  /** Lấy danh sách tiêu chí thi đua đang hoạt động */
  findAll() {
    return this.tieuChiRepo.find({ where: { trang_thai: true }, order: { nhom_tieu_chi: 'ASC' } });
  }

  /** Tạo mới tiêu chí thi đua */
  create(data: Partial<DanhMucTieuChi>) {
    const tc = this.tieuChiRepo.create(data);
    return this.tieuChiRepo.save(tc);
  }
}
