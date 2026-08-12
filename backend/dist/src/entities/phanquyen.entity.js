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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhanQuyen = void 0;
const typeorm_1 = require("typeorm");
const lop_entity_1 = require("./lop.entity");
let PhanQuyen = class PhanQuyen {
    phan_quyen_id;
    lop_id;
    vai_tro_thi_dua;
    duoc_cham_to_vien;
    duoc_cham_to_truong;
    duoc_cham_ngoai_to;
    duoc_duyet_huy_diem;
    lop;
};
exports.PhanQuyen = PhanQuyen;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PhanQuyen.prototype, "phan_quyen_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PhanQuyen.prototype, "lop_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], PhanQuyen.prototype, "vai_tro_thi_dua", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], PhanQuyen.prototype, "duoc_cham_to_vien", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], PhanQuyen.prototype, "duoc_cham_to_truong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PhanQuyen.prototype, "duoc_cham_ngoai_to", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PhanQuyen.prototype, "duoc_duyet_huy_diem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lop_entity_1.Lop, (lop) => lop.phan_quyen, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'lop_id' }),
    __metadata("design:type", lop_entity_1.Lop)
], PhanQuyen.prototype, "lop", void 0);
exports.PhanQuyen = PhanQuyen = __decorate([
    (0, typeorm_1.Entity)('td_phanquyen'),
    (0, typeorm_1.Unique)(['lop_id', 'vai_tro_thi_dua'])
], PhanQuyen);
//# sourceMappingURL=phanquyen.entity.js.map