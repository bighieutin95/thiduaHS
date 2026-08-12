"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const nguoidung_entity_1 = require("./entities/nguoidung.entity");
const nienhoc_entity_1 = require("./entities/nienhoc.entity");
const hocky_entity_1 = require("./entities/hocky.entity");
const lop_entity_1 = require("./entities/lop.entity");
const to_entity_1 = require("./entities/to.entity");
const hocsinh_entity_1 = require("./entities/hocsinh.entity");
const danhmuc_tieuchi_entity_1 = require("./entities/danhmuc-tieuchi.entity");
const lichsu_chamdiem_entity_1 = require("./entities/lichsu-chamdiem.entity");
const tonghop_tuan_entity_1 = require("./entities/tonghop-tuan.entity");
const tonghop_thang_entity_1 = require("./entities/tonghop-thang.entity");
const phanquyen_entity_1 = require("./entities/phanquyen.entity");
const auth_module_1 = require("./modules/auth/auth.module");
const lop_module_1 = require("./modules/lop/lop.module");
const hoc_sinh_module_1 = require("./modules/hoc-sinh/hoc-sinh.module");
const tieu_chi_module_1 = require("./modules/tieu-chi/tieu-chi.module");
const cham_diem_module_1 = require("./modules/cham-diem/cham-diem.module");
const phan_quyen_module_1 = require("./modules/phan-quyen/phan-quyen.module");
const bao_cao_module_1 = require("./modules/bao-cao/bao-cao.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
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
                        nguoidung_entity_1.NguoiDung, nienhoc_entity_1.NienHoc, hocky_entity_1.HocKy, lop_entity_1.Lop, to_entity_1.To, hocsinh_entity_1.HocSinh,
                        danhmuc_tieuchi_entity_1.DanhMucTieuChi, lichsu_chamdiem_entity_1.LichSuChamDiem, tonghop_tuan_entity_1.TongHopTuan, tonghop_thang_entity_1.TongHopThang, phanquyen_entity_1.PhanQuyen,
                    ],
                    synchronize: false,
                    logging: false,
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            lop_module_1.LopModule,
            hoc_sinh_module_1.HocSinhModule,
            tieu_chi_module_1.TieuChiModule,
            cham_diem_module_1.ChamDiemModule,
            phan_quyen_module_1.PhanQuyenModule,
            bao_cao_module_1.BaoCaoModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map