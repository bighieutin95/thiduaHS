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
exports.LopService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lop_entity_1 = require("../../entities/lop.entity");
const to_entity_1 = require("../../entities/to.entity");
const hocsinh_entity_1 = require("../../entities/hocsinh.entity");
let LopService = class LopService {
    lopRepo;
    toRepo;
    hocSinhRepo;
    constructor(lopRepo, toRepo, hocSinhRepo) {
        this.lopRepo = lopRepo;
        this.toRepo = toRepo;
        this.hocSinhRepo = hocSinhRepo;
    }
    findAll() {
        return this.lopRepo.find({ relations: ['nien_hoc', 'to'] });
    }
    findStudentsByClass(lopId) {
        return this.hocSinhRepo.find({
            where: { lop_id: lopId },
            relations: ['to'],
            order: { ho_ten: 'ASC' },
        });
    }
    async create(data) {
        const lop = this.lopRepo.create(data);
        const savedLop = await this.lopRepo.save(lop);
        for (let i = 1; i <= 4; i++) {
            const to = this.toRepo.create({
                lop_id: savedLop.lop_id,
                ten_to: `Tổ ${i}`,
            });
            await this.toRepo.save(to);
        }
        return savedLop;
    }
    async update(id, data) {
        const lop = await this.lopRepo.findOne({ where: { lop_id: id } });
        if (!lop)
            throw new common_1.NotFoundException('Không tìm thấy lớp học');
        Object.assign(lop, data);
        return this.lopRepo.save(lop);
    }
    async remove(id) {
        const lop = await this.lopRepo.findOne({ where: { lop_id: id } });
        if (!lop)
            throw new common_1.NotFoundException('Không tìm thấy lớp học');
        await this.toRepo.delete({ lop_id: id });
        await this.lopRepo.delete({ lop_id: id });
        return { message: 'Đã xóa lớp học thành công' };
    }
};
exports.LopService = LopService;
exports.LopService = LopService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lop_entity_1.Lop)),
    __param(1, (0, typeorm_1.InjectRepository)(to_entity_1.To)),
    __param(2, (0, typeorm_1.InjectRepository)(hocsinh_entity_1.HocSinh)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LopService);
//# sourceMappingURL=lop.service.js.map