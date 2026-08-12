import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HocSinh } from '../../entities/hocsinh.entity';

@Injectable()
export class HocSinhService {
  constructor(
    @InjectRepository(HocSinh) private hocSinhRepo: Repository<HocSinh>,
  ) {}

  /** Lấy danh sách học sinh theo lớp */
  findByLop(lopId: number) {
    return this.hocSinhRepo.find({
      where: { lop_id: lopId },
      relations: ['to', 'lop'],
      order: { to_id: 'ASC', ho_ten: 'ASC' },
    });
  }

  /** Tạo học sinh mới */
  async create(data: Partial<HocSinh>) {
    const hs = this.hocSinhRepo.create(data);
    return this.hocSinhRepo.save(hs);
  }

  /** Cập nhật thông tin học sinh */
  async update(id: number, data: Partial<HocSinh>) {
    const hs = await this.hocSinhRepo.findOne({ where: { hoc_sinh_id: id } });
    if (!hs) throw new NotFoundException('Không tìm thấy học sinh');
    Object.assign(hs, data);
    return this.hocSinhRepo.save(hs);
  }

  /** Xóa một học sinh */
  async remove(id: number) {
    await this.hocSinhRepo.delete({ hoc_sinh_id: id });
    return { message: 'Đã xóa học sinh thành công' };
  }

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
