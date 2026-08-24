import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DanhMucTieuChi } from '../../entities/danhmuc-tieuchi.entity';

@Injectable()
export class TieuChiService {
  constructor(
    @InjectRepository(DanhMucTieuChi) private tieuChiRepo: Repository<DanhMucTieuChi>,
  ) {}

  /** Lấy danh sách tiêu chí thi đua */
  findAll(showAll = false) {
    if (showAll) {
      return this.tieuChiRepo.find({ order: { nhom_tieu_chi: 'ASC', ten_tieu_chi: 'ASC' } });
    }
    return this.tieuChiRepo.find({ where: { trang_thai: true }, order: { nhom_tieu_chi: 'ASC', ten_tieu_chi: 'ASC' } });
  }

  /** Tạo mới tiêu chí thi đua */
  create(data: Partial<DanhMucTieuChi>) {
    const tc = this.tieuChiRepo.create(data);
    return this.tieuChiRepo.save(tc);
  }

  /** Cập nhật tiêu chí thi đua */
  async update(id: number, data: Partial<DanhMucTieuChi>) {
    const tc = await this.tieuChiRepo.findOne({ where: { tieu_chi_id: id } });
    if (!tc) throw new Error('Không tìm thấy tiêu chí thi đua');
    Object.assign(tc, data);
    return this.tieuChiRepo.save(tc);
  }

  /** Xóa mềm tiêu chí thi đua */
  async remove(id: number) {
    const tc = await this.tieuChiRepo.findOne({ where: { tieu_chi_id: id } });
    if (!tc) throw new Error('Không tìm thấy tiêu chí thi đua');
    tc.trang_thai = false; // Xóa mềm để bảo toàn lịch sử chấm điểm cũ
    return this.tieuChiRepo.save(tc);
  }
}
