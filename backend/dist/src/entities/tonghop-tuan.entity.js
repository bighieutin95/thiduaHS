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
exports.TongHopTuan = void 0;
const typeorm_1 = require("typeorm");
const hocsinh_entity_1 = require("./hocsinh.entity");
const hocky_entity_1 = require("./hocky.entity");
let TongHopTuan = class TongHopTuan {
    tong_hop_tuan_id;
    hoc_sinh_id;
    hoc_ky_id;
    tuan_thu;
    diem_mac_dinh;
    tong_diem_cong;
    tong_diem_tru;
    diem_cuoi_cung;
    ngay_chot;
    hoc_sinh;
    hoc_ky;
};
exports.TongHopTuan = TongHopTuan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TongHopTuan.prototype, "tong_hop_tuan_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TongHopTuan.prototype, "hoc_sinh_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TongHopTuan.prototype, "hoc_ky_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TongHopTuan.prototype, "tuan_thu", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 100.0 }),
    __metadata("design:type", Number)
], TongHopTuan.prototype, "diem_mac_dinh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], TongHopTuan.prototype, "tong_diem_cong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], TongHopTuan.prototype, "tong_diem_tru", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], TongHopTuan.prototype, "diem_cuoi_cung", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], TongHopTuan.prototype, "ngay_chot", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hocsinh_entity_1.HocSinh, (hs) => hs.tong_hop_tuan, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'hoc_sinh_id' }),
    __metadata("design:type", hocsinh_entity_1.HocSinh)
], TongHopTuan.prototype, "hoc_sinh", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hocky_entity_1.HocKy, (hk) => hk.tong_hop_tuan),
    (0, typeorm_1.JoinColumn)({ name: 'hoc_ky_id' }),
    __metadata("design:type", hocky_entity_1.HocKy)
], TongHopTuan.prototype, "hoc_ky", void 0);
exports.TongHopTuan = TongHopTuan = __decorate([
    (0, typeorm_1.Entity)('td_tonghop_tuan'),
    (0, typeorm_1.Unique)(['hoc_sinh_id', 'hoc_ky_id', 'tuan_thu'])
], TongHopTuan);
//# sourceMappingURL=tonghop-tuan.entity.js.map