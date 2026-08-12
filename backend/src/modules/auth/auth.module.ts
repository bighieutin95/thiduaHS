import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NguoiDung } from '../../entities/nguoidung.entity';
import { HocSinh } from '../../entities/hocsinh.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NguoiDung, HocSinh])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
