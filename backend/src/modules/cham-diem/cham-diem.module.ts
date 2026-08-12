import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ChamDiemController } from './cham-diem.controller';
import { ChamDiemService } from './cham-diem.service';
import { LichSuChamDiem } from '../../entities/lichsu-chamdiem.entity';
import { HocSinh } from '../../entities/hocsinh.entity';
import { DanhMucTieuChi } from '../../entities/danhmuc-tieuchi.entity';
import { PhanQuyen } from '../../entities/phanquyen.entity';
import { TongHopTuan } from '../../entities/tonghop-tuan.entity';
import { NguoiDung } from '../../entities/nguoidung.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LichSuChamDiem, HocSinh, DanhMucTieuChi, PhanQuyen, TongHopTuan, NguoiDung
    ]),
  ],
  controllers: [ChamDiemController],
  providers: [ChamDiemService],
})
export class ChamDiemModule {}
