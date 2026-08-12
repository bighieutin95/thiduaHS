import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TongHopTuan } from '../../entities/tonghop-tuan.entity';
import { TongHopThang } from '../../entities/tonghop-thang.entity';
import { HocSinh } from '../../entities/hocsinh.entity';

@Injectable()
export class BaoCaoService {
  constructor(
    @InjectRepository(TongHopTuan) private tongHopTuanRepo: Repository<TongHopTuan>,
    @InjectRepository(TongHopThang) private tongHopThangRepo: Repository<TongHopThang>,
    @InjectRepository(HocSinh) private hocSinhRepo: Repository<HocSinh>,
  ) {}

  /** Báo cáo tổng hợp điểm tuần của tất cả học sinh trong lớp */
  async baoTuanTheoLop(lopId: number, tuanThu: number) {
    return this.tongHopTuanRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.hoc_sinh', 'hs')
      .where('hs.lop_id = :lopId', { lopId })
      .andWhere('t.tuan_thu = :tuan', { tuan: tuanThu })
      .orderBy('t.diem_cuoi_cung', 'DESC')
      .getMany();
  }

  /** Báo cáo tổng hợp điểm tháng và xếp loại của học sinh trong lớp */
  async baoThangTheoLop(lopId: number, thang: number, nam: number) {
    return this.tongHopThangRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.hoc_sinh', 'hs')
      .where('hs.lop_id = :lopId', { lopId })
      .andWhere('t.thang = :thang', { thang })
      .andWhere('t.nam = :nam', { nam })
      .orderBy('t.diem_trung_binh', 'DESC')
      .getMany();
  }
}
