import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Lop } from './lop.entity';
import { HocKy } from './hocky.entity';

@Entity('td_nienhoc')
export class NienHoc {
  @PrimaryGeneratedColumn()
  nien_hoc_id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  ten_nien_hoc: string;

  @Column({ type: 'date' })
  ngay_bat_dau: string;

  @Column({ type: 'date' })
  ngay_ket_thuc: string;

  @Column({ type: 'boolean', default: true })
  trang_thai: boolean;

  @OneToMany(() => Lop, (lop) => lop.nien_hoc)
  lop: Lop[];

  @OneToMany(() => HocKy, (hk) => hk.nien_hoc)
  hoc_ky: HocKy[];
}
