import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TieuChiController } from './tieu-chi.controller';
import { TieuChiService } from './tieu-chi.service';
import { DanhMucTieuChi } from '../../entities/danhmuc-tieuchi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DanhMucTieuChi])],
  controllers: [TieuChiController],
  providers: [TieuChiService],
  exports: [TieuChiService],
})
export class TieuChiModule {}
