import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { NienHoc } from './nienhoc.entity';
import { HocKy } from './hocky.entity';
import { To } from './to.entity';
import { PhanQuyen } from './phanquyen.entity';

@Entity('td_lop')
export class Lop {
  @PrimaryGeneratedColumn()
  lop_id: number;

  @Column({ type: 'int' })
  nien_hoc_id: number;

  @Column({ type: 'varchar', length: 50 })
  ten_lop: string;

  @Column({ type: 'int' })
  khoi: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gvcn_email: string;

  @ManyToOne(() => NienHoc, (nh) => nh.lop)
  @JoinColumn({ name: 'nien_hoc_id' })
  nien_hoc: NienHoc;

  @OneToMany(() => To, (to) => to.lop)
  to: To[];

  @OneToMany(() => PhanQuyen, (pq) => pq.lop)
  phan_quyen: PhanQuyen[];
}
