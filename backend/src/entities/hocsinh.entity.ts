import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { To } from './to.entity';
import { Lop } from './lop.entity';
import { LichSuChamDiem } from './lichsu-chamdiem.entity';
import { TongHopTuan } from './tonghop-tuan.entity';
import { TongHopThang } from './tonghop-thang.entity';

@Entity('td_hocsinh')
export class HocSinh {
  @PrimaryGeneratedColumn()
  hoc_sinh_id: number;

  @Column({ type: 'int' })
  lop_id: number;

  @Column({ type: 'int', nullable: true })
  to_id: number;

  @Column({ type: 'varchar', length: 255 })
  ho_ten: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  ma_hoc_sinh: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'HocSinh',
  })
  vai_tro_thi_dua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho' | 'HocSinh';

  @ManyToOne(() => Lop, { nullable: false })
  @JoinColumn({ name: 'lop_id' })
  lop: Lop;

  @ManyToOne(() => To, (to) => to.hoc_sinh, { nullable: true })
  @JoinColumn({ name: 'to_id' })
  to: To;

  @OneToMany(() => LichSuChamDiem, (ls) => ls.hoc_sinh)
  lich_su_cham: LichSuChamDiem[];

  @OneToMany(() => TongHopTuan, (t) => t.hoc_sinh)
  tong_hop_tuan: TongHopTuan[];

  @OneToMany(() => TongHopThang, (t) => t.hoc_sinh)
  tong_hop_thang: TongHopThang[];
}
