import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, Unique
} from 'typeorm';
import { Lop } from './lop.entity';

@Entity('td_phanquyen')
@Unique(['lop_id', 'vai_tro_thi_dua'])
export class PhanQuyen {
  @PrimaryGeneratedColumn()
  phan_quyen_id: number;

  @Column({ type: 'int' })
  lop_id: number;

  @Column({ type: 'varchar', length: 50 })
  vai_tro_thi_dua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho';

  /** Cho phép chấm học sinh bình thường trong tổ */
  @Column({ type: 'boolean', default: true })
  duoc_cham_to_vien: boolean;

  /** Cho phép chấm các tổ trưởng khác */
  @Column({ type: 'boolean', default: true })
  duoc_cham_to_truong: boolean;

  /** Cho phép chấm học sinh ngoài tổ của mình */
  @Column({ type: 'boolean', default: false })
  duoc_cham_ngoai_to: boolean;

  /** Quyền duyệt hủy các đầu điểm chấm sai */
  @Column({ type: 'boolean', default: false })
  duoc_duyet_huy_diem: boolean;

  @ManyToOne(() => Lop, (lop) => lop.phan_quyen, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lop_id' })
  lop: Lop;
}
