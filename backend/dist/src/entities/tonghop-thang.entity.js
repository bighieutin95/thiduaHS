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
exports.TongHopThang = void 0;
const typeorm_1 = require("typeorm");
const hocsinh_entity_1 = require("./hocsinh.entity");
let TongHopThang = class TongHopThang {
    tong_hop_thang_id;
    hoc_sinh_id;
    thang;
    nam;
    diem_trung_binh;
    xep_loai;
    ngay_tong_hop;
    hoc_sinh;
};
exports.TongHopThang = TongHopThang;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TongHopThang.prototype, "tong_hop_thang_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TongHopThang.prototype, "hoc_sinh_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TongHopThang.prototype, "thang", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TongHopThang.prototype, "nam", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], TongHopThang.prototype, "diem_trung_binh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], TongHopThang.prototype, "xep_loai", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], TongHopThang.prototype, "ngay_tong_hop", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hocsinh_entity_1.HocSinh, (hs) => hs.tong_hop_thang, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'hoc_sinh_id' }),
    __metadata("design:type", hocsinh_entity_1.HocSinh)
], TongHopThang.prototype, "hoc_sinh", void 0);
exports.TongHopThang = TongHopThang = __decorate([
    (0, typeorm_1.Entity)('td_tonghop_thang'),
    (0, typeorm_1.Unique)(['hoc_sinh_id', 'thang', 'nam'])
], TongHopThang);
//# sourceMappingURL=tonghop-thang.entity.js.map