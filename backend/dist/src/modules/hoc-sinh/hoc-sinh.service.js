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
exports.HocSinhService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hocsinh_entity_1 = require("../../entities/hocsinh.entity");
let HocSinhService = class HocSinhService {
    hocSinhRepo;
    constructor(hocSinhRepo) {
        this.hocSinhRepo = hocSinhRepo;
    }
    findByLop(lopId) {
        return this.hocSinhRepo.find({
            where: { lop_id: lopId },
            relations: ['to', 'lop'],
            order: { to_id: 'ASC', ho_ten: 'ASC' },
        });
    }
    async create(data) {
        const hs = this.hocSinhRepo.create(data);
        return this.hocSinhRepo.save(hs);
    }
    async update(id, data) {
        const hs = await this.hocSinhRepo.findOne({ where: { hoc_sinh_id: id } });
        if (!hs)
            throw new common_1.NotFoundException('Không tìm thấy học sinh');
        Object.assign(hs, data);
        return this.hocSinhRepo.save(hs);
    }
    async remove(id) {
        await this.hocSinhRepo.delete({ hoc_sinh_id: id });
        return { message: 'Đã xóa học sinh thành công' };
    }
    async importList(lopId, list) {
        const entities = list.map((hs) => this.hocSinhRepo.create({ ...hs, lop_id: lopId }));
        return this.hocSinhRepo.save(entities);
    }
    async updateVaiTro(hocSinhId, vaiTro) {
        await this.hocSinhRepo.update({ hoc_sinh_id: hocSinhId }, { vai_tro_thi_dua: vaiTro });
        return { message: 'Cập nhật vai trò thành công' };
    }
};
exports.HocSinhService = HocSinhService;
exports.HocSinhService = HocSinhService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hocsinh_entity_1.HocSinh)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HocSinhService);
//# sourceMappingURL=hoc-sinh.service.js.map