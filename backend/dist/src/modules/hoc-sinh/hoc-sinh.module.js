"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HocSinhModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hoc_sinh_controller_1 = require("./hoc-sinh.controller");
const hoc_sinh_service_1 = require("./hoc-sinh.service");
const hocsinh_entity_1 = require("../../entities/hocsinh.entity");
const to_entity_1 = require("../../entities/to.entity");
let HocSinhModule = class HocSinhModule {
};
exports.HocSinhModule = HocSinhModule;
exports.HocSinhModule = HocSinhModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([hocsinh_entity_1.HocSinh, to_entity_1.To])],
        controllers: [hoc_sinh_controller_1.HocSinhController],
        providers: [hoc_sinh_service_1.HocSinhService],
        exports: [hoc_sinh_service_1.HocSinhService],
    })
], HocSinhModule);
//# sourceMappingURL=hoc-sinh.module.js.map