import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhanQuyenController } from './phan-quyen.controller';
import { PhanQuyenService } from './phan-quyen.service';
import { PhanQuyen } from '../../entities/phanquyen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhanQuyen])],
  controllers: [PhanQuyenController],
  providers: [PhanQuyenService],
  exports: [PhanQuyenService],
})
export class PhanQuyenModule {}
