import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LopController } from './lop.controller';
import { LopService } from './lop.service';
import { Lop } from '../../entities/lop.entity';
import { To } from '../../entities/to.entity';
import { HocSinh } from '../../entities/hocsinh.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lop, To, HocSinh])],
  controllers: [LopController],
  providers: [LopService],
  exports: [LopService],
})
export class LopModule {}
