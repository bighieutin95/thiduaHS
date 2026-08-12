import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, CreateDateColumn, Unique
} from 'typeorm';
import { HocSinh } from './hocsinh.entity';
import { HocKy } from './hocky.entity';

@Entity('td_tonghop_tuan')
@Unique(['hoc_sinh_id', 'hoc_ky_id', 'tuan_thu'])
export class TongHopTuan {
  @PrimaryGeneratedColumn()
  tong_hop_tuan_id: number;

  @Column({ type: 'int' })
  hoc_sinh_id: number;

  @Column({ type: 'int' })
  hoc_ky_id: number;

  @Column({ type: 'int' })
  tuan_thu: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100.0 })
  diem_mac_dinh: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  tong_diem_cong: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  tong_diem_tru: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  diem_cuoi_cung: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  ngay_chot: Date;

  @ManyToOne(() => HocSinh, (hs) => hs.tong_hop_tuan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hoc_sinh_id' })
  hoc_sinh: HocSinh;

  @ManyToOne(() => HocKy, (hk) => hk.tong_hop_tuan)
  @JoinColumn({ name: 'hoc_ky_id' })
  hoc_ky: HocKy;
}
