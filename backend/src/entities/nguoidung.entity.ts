import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { LichSuChamDiem } from './lichsu-chamdiem.entity';

@Entity('td_nguoidung')
export class NguoiDung {
  @PrimaryColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ho_ten: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'varchar', length: 50, default: 'User' })
  vai_tro_he_thong: 'Admin' | 'User';

  @CreateDateColumn({ type: 'timestamp with time zone' })
  ngay_tao: Date;

  @OneToMany(() => LichSuChamDiem, (history) => history.nguoi_cham)
  lich_su_cham: LichSuChamDiem[];
}
