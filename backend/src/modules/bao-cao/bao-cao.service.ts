import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TongHopTuan } from '../../entities/tonghop-tuan.entity';
import { TongHopThang } from '../../entities/tonghop-thang.entity';
import { HocSinh } from '../../entities/hocsinh.entity';
import { LichSuChamDiem } from '../../entities/lichsu-chamdiem.entity';

@Injectable()
export class BaoCaoService {
  constructor(
    @InjectRepository(TongHopTuan) private readonly tongHopTuanRepo: Repository<TongHopTuan>,
    @InjectRepository(TongHopThang) private readonly tongHopThangRepo: Repository<TongHopThang>,
    @InjectRepository(HocSinh) private readonly hocSinhRepo: Repository<HocSinh>,
    @InjectRepository(LichSuChamDiem) private readonly lichSuRepo: Repository<LichSuChamDiem>,
  ) {}

  /** Báo cáo tổng hợp điểm tuần đã chốt của tất cả học sinh trong lớp */
  async baoTuanTheoLop(lopId: number, tuanThu: number) {
    return this.tongHopTuanRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.hoc_sinh', 'hs')
      .where('hs.lop_id = :lopId', { lopId })
      .andWhere('t.tuan_thu = :tuan', { tuan: tuanThu })
      .orderBy('t.diem_cuoi_cung', 'DESC')
      .getMany();
  }

  /** Báo cáo tổng hợp điểm tuần thời gian thực (realtime) phục vụ hiển thị Dashboard */
  async baoTuanRealtime(lopId: number, tuanThu: number) {
    const students = await this.hocSinhRepo.find({
      where: { lop_id: lopId },
      relations: ['to'],
    });

    const history = await this.lichSuRepo.find({
      where: { tuan_thu: tuanThu, trang_thai: 'HieuLuc' },
      relations: ['tieu_chi'],
    });

    return students.map((hs) => {
      const hsHistory = history.filter((h) => h.hoc_sinh_id === hs.hoc_sinh_id);
      let tongCong = 0;
      let tongTru = 0;
      for (const h of hsHistory) {
        if (h.tieu_chi?.loai === 'Cong') {
          tongCong += Number(h.so_diem_thuc_te);
        } else {
          tongTru += Number(h.so_diem_thuc_te);
        }
      }
      return {
        hoc_sinh: hs,
        tuan_thu: tuanThu,
        diem_mac_dinh: 100.0,
        tong_diem_cong: tongCong,
        tong_diem_tru: tongTru,
        diem_cuoi_cung: 100.0 + tongCong - tongTru,
      };
    }).sort((a, b) => b.diem_cuoi_cung - a.diem_cuoi_cung);
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
