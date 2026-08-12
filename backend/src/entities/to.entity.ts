import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Lop } from './lop.entity';
import { HocSinh } from './hocsinh.entity';

@Entity('td_to')
export class To {
  @PrimaryGeneratedColumn()
  to_id: number;

  @Column({ type: 'int' })
  lop_id: number;

  @Column({ type: 'varchar', length: 50 })
  ten_to: string;

  @ManyToOne(() => Lop, (lop) => lop.to, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lop_id' })
  lop: Lop;

  @OneToMany(() => HocSinh, (hs) => hs.to)
  hoc_sinh: HocSinh[];
}
