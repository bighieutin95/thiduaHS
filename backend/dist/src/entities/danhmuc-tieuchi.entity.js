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
exports.DanhMucTieuChi = void 0;
const typeorm_1 = require("typeorm");
const lichsu_chamdiem_entity_1 = require("./lichsu-chamdiem.entity");
let DanhMucTieuChi = class DanhMucTieuChi {
    tieu_chi_id;
    ten_tieu_chi;
    nhom_tieu_chi;
    loai;
    so_diem;
    trang_thai;
    lich_su_cham;
};
exports.DanhMucTieuChi = DanhMucTieuChi;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DanhMucTieuChi.prototype, "tieu_chi_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], DanhMucTieuChi.prototype, "ten_tieu_chi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], DanhMucTieuChi.prototype, "nhom_tieu_chi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], DanhMucTieuChi.prototype, "loai", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], DanhMucTieuChi.prototype, "so_diem", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], DanhMucTieuChi.prototype, "trang_thai", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lichsu_chamdiem_entity_1.LichSuChamDiem, (ls) => ls.tieu_chi),
    __metadata("design:type", Array)
], DanhMucTieuChi.prototype, "lich_su_cham", void 0);
exports.DanhMucTieuChi = DanhMucTieuChi = __decorate([
    (0, typeorm_1.Entity)('td_danhmuc_tieuchi')
], DanhMucTieuChi);
//# sourceMappingURL=danhmuc-tieuchi.entity.js.map