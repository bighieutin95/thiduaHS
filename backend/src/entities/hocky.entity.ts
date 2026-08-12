import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { NienHoc } from './nienhoc.entity';
import { TongHopTuan } from './tonghop-tuan.entity';

@Entity('td_hocky')
export class HocKy {
  @PrimaryGeneratedColumn()
  hoc_ky_id: number;

  @Column({ type: 'int' })
  nien_hoc_id: number;

  @Column({ type: 'varchar', length: 50 })
  ten_hoc_ky: string;

  @Column({ type: 'boolean', default: true })
  trang_thai: boolean;

  @ManyToOne(() => NienHoc, (nh) => nh.hoc_ky, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nien_hoc_id' })
  nien_hoc: NienHoc;

  @OneToMany(() => TongHopTuan, (t) => t.hoc_ky)
  tong_hop_tuan: TongHopTuan[];
}
