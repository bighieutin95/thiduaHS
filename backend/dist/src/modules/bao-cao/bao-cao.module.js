"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaoCaoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bao_cao_controller_1 = require("./bao-cao.controller");
const bao_cao_service_1 = require("./bao-cao.service");
const tonghop_tuan_entity_1 = require("../../entities/tonghop-tuan.entity");
const tonghop_thang_entity_1 = require("../../entities/tonghop-thang.entity");
const hocsinh_entity_1 = require("../../entities/hocsinh.entity");
const lichsu_chamdiem_entity_1 = require("../../entities/lichsu-chamdiem.entity");
let BaoCaoModule = class BaoCaoModule {
};
exports.BaoCaoModule = BaoCaoModule;
exports.BaoCaoModule = BaoCaoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tonghop_tuan_entity_1.TongHopTuan, tonghop_thang_entity_1.TongHopThang, hocsinh_entity_1.HocSinh, lichsu_chamdiem_entity_1.LichSuChamDiem])],
        controllers: [bao_cao_controller_1.BaoCaoController],
        providers: [bao_cao_service_1.BaoCaoService],
    })
], BaoCaoModule);
//# sourceMappingURL=bao-cao.module.js.map