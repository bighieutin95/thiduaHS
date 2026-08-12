import { Injectable } from '@nestjs/common';
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
    return this.lopRepo.save(lop);
  }
}
