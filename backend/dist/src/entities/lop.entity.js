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
exports.Lop = void 0;
const typeorm_1 = require("typeorm");
const nienhoc_entity_1 = require("./nienhoc.entity");
const to_entity_1 = require("./to.entity");
const phanquyen_entity_1 = require("./phanquyen.entity");
let Lop = class Lop {
    lop_id;
    nien_hoc_id;
    ten_lop;
    khoi;
    gvcn_email;
    nien_hoc;
    to;
    phan_quyen;
};
exports.Lop = Lop;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Lop.prototype, "lop_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Lop.prototype, "nien_hoc_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Lop.prototype, "ten_lop", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Lop.prototype, "khoi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Lop.prototype, "gvcn_email", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nienhoc_entity_1.NienHoc, (nh) => nh.lop),
    (0, typeorm_1.JoinColumn)({ name: 'nien_hoc_id' }),
    __metadata("design:type", nienhoc_entity_1.NienHoc)
], Lop.prototype, "nien_hoc", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => to_entity_1.To, (to) => to.lop),
    __metadata("design:type", Array)
], Lop.prototype, "to", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => phanquyen_entity_1.PhanQuyen, (pq) => pq.lop),
    __metadata("design:type", Array)
], Lop.prototype, "phan_quyen", void 0);
exports.Lop = Lop = __decorate([
    (0, typeorm_1.Entity)('td_lop')
], Lop);
//# sourceMappingURL=lop.entity.js.map