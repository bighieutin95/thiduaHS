import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lop } from '../../entities/lop.entity';
import { To } from '../../entities/to.entity';
import { HocSinh } from '../../entities/hocsinh.entity';

@Injectable()
export class LopService {
  constructor(
    @InjectRepository(Lop) private lopRepo: Repository<Lop>,
    @InjectRepository(To) private toRepo: Repository<To>,
    @InjectRepository(HocSinh) private hocSinhRepo: Repository<HocSinh>,
  ) {}

  /** Lấy tất cả lớp học */
  findAll() {
    return this.lopRepo.find({ relations: ['nien_hoc', 'to'] });
  }

  /** Lấy danh sách học sinh của một lớp */
  findStudentsByClass(lopId: number) {
    return this.hocSinhRepo.find({
      where: { lop_id: lopId },
      relations: ['to'],
      order: { ho_ten: 'ASC' },
    });
  }

  /** Tạo lớp học mới */
  async create(data: Partial<Lop>) {
    const lop = this.lopRepo.create(data);
    const savedLop = await this.lopRepo.save(lop);
    
    // Tự động tạo mặc định 4 tổ cho lớp học mới
    for (let i = 1; i <= 4; i++) {
      const to = this.toRepo.create({
        lop_id: savedLop.lop_id,
        ten_to: `Tổ ${i}`,
      });
      await this.toRepo.save(to);
    }
    
    return savedLop;
  }

  /** Cập nhật thông tin lớp học */
  async update(id: number, data: Partial<Lop>) {
    const lop = await this.lopRepo.findOne({ where: { lop_id: id } });
    if (!lop) throw new NotFoundException('Không tìm thấy lớp học');
    Object.assign(lop, data);
    return this.lopRepo.save(lop);
  }

  /** Xóa một lớp học */
  async remove(id: number) {
    const lop = await this.lopRepo.findOne({ where: { lop_id: id } });
    if (!lop) throw new NotFoundException('Không tìm thấy lớp học');
    
    // Xóa liên đới các tổ và học sinh có thể xử lý qua database cascade hoặc xóa thủ công ở đây
    await this.toRepo.delete({ lop_id: id });
    await this.lopRepo.delete({ lop_id: id });
    return { message: 'Đã xóa lớp học thành công' };
  }
}
