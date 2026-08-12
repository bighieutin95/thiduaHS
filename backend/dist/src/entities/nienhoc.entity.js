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
exports.NienHoc = void 0;
const typeorm_1 = require("typeorm");
const lop_entity_1 = require("./lop.entity");
const hocky_entity_1 = require("./hocky.entity");
let NienHoc = class NienHoc {
    nien_hoc_id;
    ten_nien_hoc;
    ngay_bat_dau;
    ngay_ket_thuc;
    trang_thai;
    lop;
    hoc_ky;
};
exports.NienHoc = NienHoc;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NienHoc.prototype, "nien_hoc_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], NienHoc.prototype, "ten_nien_hoc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], NienHoc.prototype, "ngay_bat_dau", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], NienHoc.prototype, "ngay_ket_thuc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], NienHoc.prototype, "trang_thai", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lop_entity_1.Lop, (lop) => lop.nien_hoc),
    __metadata("design:type", Array)
], NienHoc.prototype, "lop", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hocky_entity_1.HocKy, (hk) => hk.nien_hoc),
    __metadata("design:type", Array)
], NienHoc.prototype, "hoc_ky", void 0);
exports.NienHoc = NienHoc = __decorate([
    (0, typeorm_1.Entity)('td_nienhoc')
], NienHoc);
//# sourceMappingURL=nienhoc.entity.js.map