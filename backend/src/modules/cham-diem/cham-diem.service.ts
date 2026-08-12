import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LichSuChamDiem } from '../../entities/lichsu-chamdiem.entity';
import { HocSinh } from '../../entities/hocsinh.entity';
import { DanhMucTieuChi } from '../../entities/danhmuc-tieuchi.entity';
import { PhanQuyen } from '../../entities/phanquyen.entity';
import { TongHopTuan } from '../../entities/tonghop-tuan.entity';
import { NguoiDung } from '../../entities/nguoidung.entity';

@Injectable()
export class ChamDiemService {
  private readonly logger = new Logger(ChamDiemService.name);

  constructor(
    @InjectRepository(LichSuChamDiem) private lichSuRepo: Repository<LichSuChamDiem>,
    @InjectRepository(HocSinh) private hocSinhRepo: Repository<HocSinh>,
    @InjectRepository(DanhMucTieuChi) private tieuChiRepo: Repository<DanhMucTieuChi>,
    @InjectRepository(PhanQuyen) private phanQuyenRepo: Repository<PhanQuyen>,
    @InjectRepository(TongHopTuan) private tongHopTuanRepo: Repository<TongHopTuan>,
    @InjectRepository(NguoiDung) private nguoiDungRepo: Repository<NguoiDung>,
  ) {}

  /**
   * Tính số thứ tự tuần học dựa trên ngày vi phạm.
   * Sử dụng ISO week number.
   */
  private getTuanThu(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }

  /**
   * Kiểm tra xem tuần hiện tại đã bị chốt chưa.
   * Chốt điểm vào 22h00 thứ Sáu hàng tuần.
   */
  private isTuanDaChot(ngayViPham: Date): boolean {
    const now = new Date();
    const dayOfWeek = ngayViPham.getDay(); // 0=Sun, 5=Fri
    const diffToFriday = (5 - dayOfWeek + 7) % 7;
    const friday = new Date(ngayViPham);
    friday.setDate(ngayViPham.getDate() + diffToFriday);
    friday.setHours(22, 0, 0, 0);
    return now > friday;
  }

  /**
   * Ghi nhận một đầu điểm thi đua (cộng hoặc trừ) cho học sinh.
   */
  async ghi(userId: string, body: {
    hoc_sinh_id: number;
    tieu_chi_id: number;
    ngay_vi_pham: string;
    mo_ta?: string;
    hinh_anh_minh_chung?: string;
  }) {
    const ngayViPham = new Date(body.ngay_vi_pham);
    if (this.isTuanDaChot(ngayViPham)) {
      throw new BadRequestException('Tuần học đã bị chốt lúc 22h00 thứ Sáu. Không thể chấm điểm cho ngày này.');
    }

    const tieuChi = await this.tieuChiRepo.findOne({ where: { tieu_chi_id: body.tieu_chi_id } });
    if (!tieuChi) throw new NotFoundException('Không tìm thấy tiêu chí thi đua.');

    const tuanThu = this.getTuanThu(ngayViPham);
    const record = this.lichSuRepo.create({
      nguoi_cham_id: userId,
      hoc_sinh_id: body.hoc_sinh_id,
      tieu_chi_id: body.tieu_chi_id,
      so_diem_thuc_te: tieuChi.so_diem,
      ngay_vi_pham: body.ngay_vi_pham,
      mo_ta: body.mo_ta,
      hinh_anh_minh_chung: body.hinh_anh_minh_chung,
      tuan_thu: tuanThu,
      trang_thai: 'HieuLuc',
    });
    return this.lichSuRepo.save(record);
  }

  /** Lấy lịch sử chấm điểm */
  findHistory(filters: { hoc_sinh_id?: number; lop_id?: number; tuan_thu?: number }) {
    const query = this.lichSuRepo.createQueryBuilder('ls')
      .leftJoinAndSelect('ls.hoc_sinh', 'hs')
      .leftJoinAndSelect('ls.tieu_chi', 'tc')
      .leftJoinAndSelect('ls.nguoi_cham', 'nd');

    if (filters.hoc_sinh_id) query.andWhere('ls.hoc_sinh_id = :id', { id: filters.hoc_sinh_id });
    if (filters.tuan_thu) query.andWhere('ls.tuan_thu = :tuan', { tuan: filters.tuan_thu });
    return query.orderBy('ls.ngay_cham', 'DESC').getMany();
  }

  /** Hủy một đầu điểm chấm sai */
  async huyDiem(lichSuId: string) {
    const record = await this.lichSuRepo.findOne({ where: { lich_su_id: lichSuId } });
    if (!record) throw new NotFoundException('Không tìm thấy bản ghi chấm điểm.');
    if (this.isTuanDaChot(new Date(record.ngay_vi_pham))) {
      throw new BadRequestException('Tuần đã chốt, không thể hủy điểm.');
    }
    await this.lichSuRepo.update({ lich_su_id: lichSuId }, { trang_thai: 'BiHuy' });
    return { message: 'Đã hủy điểm thành công' };
  }

  /**
   * CRON JOB: Tự động chốt điểm tuần vào 22h00 tối thứ Sáu hàng tuần.
   * Cron expression: 0 22 * * 5 (22:00 every Friday - Vietnam UTC+7)
   * Trên server UTC, cần đặt thành 0 15 * * 5 (15:00 UTC = 22:00 UTC+7)
   */
  @Cron('0 15 * * 5', { name: 'chot-diem-tuan', timeZone: 'UTC' })
  async chotDiemTuan() {
    this.logger.log('🔒 Bắt đầu chốt điểm thi đua tuần...');
    const hocSinhList = await this.hocSinhRepo.find();
    const now = new Date();
    const tuanThu = this.getTuanThu(now);

    for (const hs of hocSinhList) {
      const lichSuTuan = await this.lichSuRepo.find({
        where: { hoc_sinh_id: hs.hoc_sinh_id, tuan_thu: tuanThu, trang_thai: 'HieuLuc' },
        relations: ['tieu_chi'],
      });

      let tongCong = 0;
      let tongTru = 0;
      for (const ls of lichSuTuan) {
        if (ls.tieu_chi.loai === 'Cong') tongCong += Number(ls.so_diem_thuc_te);
        else tongTru += Number(ls.so_diem_thuc_te);
      }

      const diemCuoiCung = 100.0 + tongCong - tongTru;

      await this.tongHopTuanRepo.upsert(
        {
          hoc_sinh_id: hs.hoc_sinh_id,
          hoc_ky_id: 1, // TODO: lấy học kỳ hiện tại động từ database
          tuan_thu: tuanThu,
          diem_mac_dinh: 100.0,
          tong_diem_cong: tongCong,
          tong_diem_tru: tongTru,
          diem_cuoi_cung: diemCuoiCung,
        },
        ['hoc_sinh_id', 'hoc_ky_id', 'tuan_thu'],
      );
    }
    this.logger.log(`✅ Hoàn thành chốt điểm tuần ${tuanThu} cho ${hocSinhList.length} học sinh.`);
  }
}
