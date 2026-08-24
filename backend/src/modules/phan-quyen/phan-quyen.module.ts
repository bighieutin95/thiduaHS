import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhanQuyenController } from './phan-quyen.controller';
import { PhanQuyenService } from './phan-quyen.service';
import { PhanQuyen } from '../../entities/phanquyen.entity';
import { NguoiDung } from '../../entities/nguoidung.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhanQuyen, NguoiDung])],
  controllers: [PhanQuyenController],
  providers: [PhanQuyenService],
  exports: [PhanQuyenService],
})
export class PhanQuyenModule {}
