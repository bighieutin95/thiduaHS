import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// Entities
import { NguoiDung } from './entities/nguoidung.entity';
import { NienHoc } from './entities/nienhoc.entity';
import { HocKy } from './entities/hocky.entity';
import { Lop } from './entities/lop.entity';
import { To } from './entities/to.entity';
import { HocSinh } from './entities/hocsinh.entity';
import { DanhMucTieuChi } from './entities/danhmuc-tieuchi.entity';
import { LichSuChamDiem } from './entities/lichsu-chamdiem.entity';
import { TongHopTuan } from './entities/tonghop-tuan.entity';
import { TongHopThang } from './entities/tonghop-thang.entity';
import { PhanQuyen } from './entities/phanquyen.entity';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { LopModule } from './modules/lop/lop.module';
import { HocSinhModule } from './modules/hoc-sinh/hoc-sinh.module';
import { TieuChiModule } from './modules/tieu-chi/tieu-chi.module';
import { ChamDiemModule } from './modules/cham-diem/cham-diem.module';
import { PhanQuyenModule } from './modules/phan-quyen/phan-quyen.module';
import { BaoCaoModule } from './modules/bao-cao/bao-cao.module';

@Module({
  imports: [
    // Tải biến môi trường từ file .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Cấu hình TypeORM kết nối Supabase PostgreSQL
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: 'aws-0-ap-southeast-1.pooler.supabase.com',
        port: 5432,
        username: 'postgres.lhqzllnnzhdktesjlgwq',
        password: 'Hnth1979@#.Hi',
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        entities: [
          NguoiDung, NienHoc, HocKy, Lop, To, HocSinh,
          DanhMucTieuChi, LichSuChamDiem, TongHopTuan, TongHopThang, PhanQuyen,
        ],
        synchronize: false,
        logging: false,
      }),
    }),

    // Kích hoạt Cron job (dùng cho chốt điểm 22h00 thứ Sáu)
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    LopModule,
    HocSinhModule,
    TieuChiModule,
    ChamDiemModule,
    PhanQuyenModule,
    BaoCaoModule,
  ],
})
export class AppModule {}
