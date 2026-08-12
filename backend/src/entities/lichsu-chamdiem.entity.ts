import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { NguoiDung } from './nguoidung.entity';
import { HocSinh } from './hocsinh.entity';
import { DanhMucTieuChi } from './danhmuc-tieuchi.entity';

@Entity('td_lichsu_chamdiem')
export class LichSuChamDiem {
  @PrimaryGeneratedColumn('uuid')
  lich_su_id: string;

  @Column({ type: 'uuid' })
  nguoi_cham_id: string;

  @Column({ type: 'int' })
  hoc_sinh_id: number;

  @Column({ type: 'int' })
  tieu_chi_id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  so_diem_thuc_te: number;

  @Column({ type: 'date' })
  ngay_vi_pham: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  ngay_cham: Date;

  @Column({ type: 'text', nullable: true })
  mo_ta: string;

  @Column({ type: 'text', nullable: true })
  hinh_anh_minh_chung: string;

  @Column({ type: 'int' })
  tuan_thu: number;

  @Column({ type: 'varchar', length: 20, default: 'HieuLuc' })
  trang_thai: 'HieuLuc' | 'BiHuy';

  @ManyToOne(() => NguoiDung, (nd) => nd.lich_su_cham)
  @JoinColumn({ name: 'nguoi_cham_id' })
  nguoi_cham: NguoiDung;

  @ManyToOne(() => HocSinh, (hs) => hs.lich_su_cham, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hoc_sinh_id' })
  hoc_sinh: HocSinh;

  @ManyToOne(() => DanhMucTieuChi, (tc) => tc.lich_su_cham)
  @JoinColumn({ name: 'tieu_chi_id' })
  tieu_chi: DanhMucTieuChi;
}
