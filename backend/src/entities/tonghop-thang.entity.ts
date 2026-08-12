import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, CreateDateColumn, Unique
} from 'typeorm';
import { HocSinh } from './hocsinh.entity';

@Entity('td_tonghop_thang')
@Unique(['hoc_sinh_id', 'thang', 'nam'])
export class TongHopThang {
  @PrimaryGeneratedColumn()
  tong_hop_thang_id: number;

  @Column({ type: 'int' })
  hoc_sinh_id: number;

  @Column({ type: 'int' })
  thang: number;

  @Column({ type: 'int' })
  nam: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  diem_trung_binh: number;

  @Column({ type: 'varchar', length: 50 })
  xep_loai: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  ngay_tong_hop: Date;

  @ManyToOne(() => HocSinh, (hs) => hs.tong_hop_thang, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hoc_sinh_id' })
  hoc_sinh: HocSinh;
}
