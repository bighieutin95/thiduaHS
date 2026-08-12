import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LichSuChamDiem } from './lichsu-chamdiem.entity';

@Entity('td_danhmuc_tieuchi')
export class DanhMucTieuChi {
  @PrimaryGeneratedColumn()
  tieu_chi_id: number;

  @Column({ type: 'varchar', length: 255 })
  ten_tieu_chi: string;

  @Column({ type: 'varchar', length: 100 })
  nhom_tieu_chi: string;

  @Column({ type: 'varchar', length: 10 })
  loai: 'Cong' | 'Tru';

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  so_diem: number;

  @Column({ type: 'boolean', default: true })
  trang_thai: boolean;

  @OneToMany(() => LichSuChamDiem, (ls) => ls.tieu_chi)
  lich_su_cham: LichSuChamDiem[];
}
