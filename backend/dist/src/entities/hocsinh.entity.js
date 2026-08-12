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
exports.HocSinh = void 0;
const typeorm_1 = require("typeorm");
const to_entity_1 = require("./to.entity");
const lop_entity_1 = require("./lop.entity");
const lichsu_chamdiem_entity_1 = require("./lichsu-chamdiem.entity");
const tonghop_tuan_entity_1 = require("./tonghop-tuan.entity");
const tonghop_thang_entity_1 = require("./tonghop-thang.entity");
let HocSinh = class HocSinh {
    hoc_sinh_id;
    lop_id;
    to_id;
    ho_ten;
    email;
    ma_hoc_sinh;
    vai_tro_thi_dua;
    lop;
    to;
    lich_su_cham;
    tong_hop_tuan;
    tong_hop_thang;
};
exports.HocSinh = HocSinh;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HocSinh.prototype, "hoc_sinh_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], HocSinh.prototype, "lop_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], HocSinh.prototype, "to_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], HocSinh.prototype, "ho_ten", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true, nullable: true }),
    __metadata("design:type", String)
], HocSinh.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true, nullable: true }),
    __metadata("design:type", String)
], HocSinh.prototype, "ma_hoc_sinh", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: 'HocSinh',
    }),
    __metadata("design:type", String)
], HocSinh.prototype, "vai_tro_thi_dua", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lop_entity_1.Lop, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'lop_id' }),
    __metadata("design:type", lop_entity_1.Lop)
], HocSinh.prototype, "lop", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => to_entity_1.To, (to) => to.hoc_sinh, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'to_id' }),
    __metadata("design:type", to_entity_1.To)
], HocSinh.prototype, "to", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lichsu_chamdiem_entity_1.LichSuChamDiem, (ls) => ls.hoc_sinh),
    __metadata("design:type", Array)
], HocSinh.prototype, "lich_su_cham", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tonghop_tuan_entity_1.TongHopTuan, (t) => t.hoc_sinh),
    __metadata("design:type", Array)
], HocSinh.prototype, "tong_hop_tuan", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tonghop_thang_entity_1.TongHopThang, (t) => t.hoc_sinh),
    __metadata("design:type", Array)
], HocSinh.prototype, "tong_hop_thang", void 0);
exports.HocSinh = HocSinh = __decorate([
    (0, typeorm_1.Entity)('td_hocsinh')
], HocSinh);
//# sourceMappingURL=hocsinh.entity.js.map