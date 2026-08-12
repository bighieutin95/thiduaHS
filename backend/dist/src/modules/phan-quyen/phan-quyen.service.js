"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhanQuyenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const phanquyen_entity_1 = require("../../entities/phanquyen.entity");
let PhanQuyenService = class PhanQuyenService {
    phanQuyenRepo;
    constructor(phanQuyenRepo) {
        this.phanQuyenRepo = phanQuyenRepo;
    }
    findByLop(lopId) {
        return this.phanQuyenRepo.find({ where: { lop_id: lopId } });
    }
    async updateByLop(lopId, configs) {
        for (const cfg of configs) {
            await this.phanQuyenRepo.upsert({ ...cfg, lop_id: lopId }, ['lop_id', 'vai_tro_thi_dua']);
        }
        return { message: 'Cập nhật phân quyền thành công' };
    }
};
exports.PhanQuyenService = PhanQuyenService;
exports.PhanQuyenService = PhanQuyenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(phanquyen_entity_1.PhanQuyen)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PhanQuyenService);
//# sourceMappingURL=phan-quyen.service.js.map