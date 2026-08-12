"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LopModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lop_controller_1 = require("./lop.controller");
const lop_service_1 = require("./lop.service");
const lop_entity_1 = require("../../entities/lop.entity");
const to_entity_1 = require("../../entities/to.entity");
const hocsinh_entity_1 = require("../../entities/hocsinh.entity");
let LopModule = class LopModule {
};
exports.LopModule = LopModule;
exports.LopModule = LopModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([lop_entity_1.Lop, to_entity_1.To, hocsinh_entity_1.HocSinh])],
        controllers: [lop_controller_1.LopController],
        providers: [lop_service_1.LopService],
        exports: [lop_service_1.LopService],
    })
], LopModule);
//# sourceMappingURL=lop.module.js.map