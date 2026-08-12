import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaoCaoController } from './bao-cao.controller';
import { BaoCaoService } from './bao-cao.service';
import { TongHopTuan } from '../../entities/tonghop-tuan.entity';
import { TongHopThang } from '../../entities/tonghop-thang.entity';
import { HocSinh } from '../../entities/hocsinh.entity';
import { LichSuChamDiem } from '../../entities/lichsu-chamdiem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TongHopTuan, TongHopThang, HocSinh, LichSuChamDiem])],
  controllers: [BaoCaoController],
  providers: [BaoCaoService],
})
export class BaoCaoModule {}
