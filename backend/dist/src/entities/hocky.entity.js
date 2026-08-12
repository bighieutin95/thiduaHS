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
exports.HocKy = void 0;
const typeorm_1 = require("typeorm");
const nienhoc_entity_1 = require("./nienhoc.entity");
const tonghop_tuan_entity_1 = require("./tonghop-tuan.entity");
let HocKy = class HocKy {
    hoc_ky_id;
    nien_hoc_id;
    ten_hoc_ky;
    trang_thai;
    nien_hoc;
    tong_hop_tuan;
};
exports.HocKy = HocKy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HocKy.prototype, "hoc_ky_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], HocKy.prototype, "nien_hoc_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], HocKy.prototype, "ten_hoc_ky", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], HocKy.prototype, "trang_thai", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nienhoc_entity_1.NienHoc, (nh) => nh.hoc_ky, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'nien_hoc_id' }),
    __metadata("design:type", nienhoc_entity_1.NienHoc)
], HocKy.prototype, "nien_hoc", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tonghop_tuan_entity_1.TongHopTuan, (t) => t.hoc_ky),
    __metadata("design:type", Array)
], HocKy.prototype, "tong_hop_tuan", void 0);
exports.HocKy = HocKy = __decorate([
    (0, typeorm_1.Entity)('td_hocky')
], HocKy);
//# sourceMappingURL=hocky.entity.js.map