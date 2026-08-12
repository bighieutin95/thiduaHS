import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HocSinhController } from './hoc-sinh.controller';
import { HocSinhService } from './hoc-sinh.service';
import { HocSinh } from '../../entities/hocsinh.entity';
import { To } from '../../entities/to.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HocSinh, To])],
  controllers: [HocSinhController],
  providers: [HocSinhService],
  exports: [HocSinhService],
})
export class HocSinhModule {}
