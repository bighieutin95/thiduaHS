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
exports.LichSuChamDiem = void 0;
const typeorm_1 = require("typeorm");
const nguoidung_entity_1 = require("./nguoidung.entity");
const hocsinh_entity_1 = require("./hocsinh.entity");
const danhmuc_tieuchi_entity_1 = require("./danhmuc-tieuchi.entity");
let LichSuChamDiem = class LichSuChamDiem {
    lich_su_id;
    nguoi_cham_id;
    hoc_sinh_id;
    tieu_chi_id;
    so_diem_thuc_te;
    ngay_vi_pham;
    ngay_cham;
    mo_ta;
    hinh_anh_minh_chung;
    tuan_thu;
    trang_thai;
    nguoi_cham;
    hoc_sinh;
    tieu_chi;
};
exports.LichSuChamDiem = LichSuChamDiem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LichSuChamDiem.prototype, "lich_su_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], LichSuChamDiem.prototype, "nguoi_cham_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LichSuChamDiem.prototype, "hoc_sinh_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LichSuChamDiem.prototype, "tieu_chi_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], LichSuChamDiem.prototype, "so_diem_thuc_te", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], LichSuChamDiem.prototype, "ngay_vi_pham", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], LichSuChamDiem.prototype, "ngay_cham", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LichSuChamDiem.prototype, "mo_ta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LichSuChamDiem.prototype, "hinh_anh_minh_chung", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LichSuChamDiem.prototype, "tuan_thu", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'HieuLuc' }),
    __metadata("design:type", String)
], LichSuChamDiem.prototype, "trang_thai", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nguoidung_entity_1.NguoiDung, (nd) => nd.lich_su_cham),
    (0, typeorm_1.JoinColumn)({ name: 'nguoi_cham_id' }),
    __metadata("design:type", nguoidung_entity_1.NguoiDung)
], LichSuChamDiem.prototype, "nguoi_cham", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hocsinh_entity_1.HocSinh, (hs) => hs.lich_su_cham, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'hoc_sinh_id' }),
    __metadata("design:type", hocsinh_entity_1.HocSinh)
], LichSuChamDiem.prototype, "hoc_sinh", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => danhmuc_tieuchi_entity_1.DanhMucTieuChi, (tc) => tc.lich_su_cham),
    (0, typeorm_1.JoinColumn)({ name: 'tieu_chi_id' }),
    __metadata("design:type", danhmuc_tieuchi_entity_1.DanhMucTieuChi)
], LichSuChamDiem.prototype, "tieu_chi", void 0);
exports.LichSuChamDiem = LichSuChamDiem = __decorate([
    (0, typeorm_1.Entity)('td_lichsu_chamdiem')
], LichSuChamDiem);
//# sourceMappingURL=lichsu-chamdiem.entity.js.map