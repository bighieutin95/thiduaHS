"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhanQuyenModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const phan_quyen_controller_1 = require("./phan-quyen.controller");
const phan_quyen_service_1 = require("./phan-quyen.service");
const phanquyen_entity_1 = require("../../entities/phanquyen.entity");
let PhanQuyenModule = class PhanQuyenModule {
};
exports.PhanQuyenModule = PhanQuyenModule;
exports.PhanQuyenModule = PhanQuyenModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([phanquyen_entity_1.PhanQuyen])],
        controllers: [phan_quyen_controller_1.PhanQuyenController],
        providers: [phan_quyen_service_1.PhanQuyenService],
        exports: [phan_quyen_service_1.PhanQuyenService],
    })
], PhanQuyenModule);
//# sourceMappingURL=phan-quyen.module.js.map