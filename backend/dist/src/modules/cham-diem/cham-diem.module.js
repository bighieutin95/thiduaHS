"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChamDiemModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cham_diem_controller_1 = require("./cham-diem.controller");
const cham_diem_service_1 = require("./cham-diem.service");
const lichsu_chamdiem_entity_1 = require("../../entities/lichsu-chamdiem.entity");
const hocsinh_entity_1 = require("../../entities/hocsinh.entity");
const danhmuc_tieuchi_entity_1 = require("../../entities/danhmuc-tieuchi.entity");
const phanquyen_entity_1 = require("../../entities/phanquyen.entity");
const tonghop_tuan_entity_1 = require("../../entities/tonghop-tuan.entity");
const nguoidung_entity_1 = require("../../entities/nguoidung.entity");
let ChamDiemModule = class ChamDiemModule {
};
exports.ChamDiemModule = ChamDiemModule;
exports.ChamDiemModule = ChamDiemModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                lichsu_chamdiem_entity_1.LichSuChamDiem, hocsinh_entity_1.HocSinh, danhmuc_tieuchi_entity_1.DanhMucTieuChi, phanquyen_entity_1.PhanQuyen, tonghop_tuan_entity_1.TongHopTuan, nguoidung_entity_1.NguoiDung
            ]),
        ],
        controllers: [cham_diem_controller_1.ChamDiemController],
        providers: [cham_diem_service_1.ChamDiemService],
    })
], ChamDiemModule);
//# sourceMappingURL=cham-diem.module.js.map