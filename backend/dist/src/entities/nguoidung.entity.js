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
exports.NguoiDung = void 0;
const typeorm_1 = require("typeorm");
const lichsu_chamdiem_entity_1 = require("./lichsu-chamdiem.entity");
let NguoiDung = class NguoiDung {
    user_id;
    email;
    ho_ten;
    avatar_url;
    vai_tro_he_thong;
    ngay_tao;
    lich_su_cham;
};
exports.NguoiDung = NguoiDung;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], NguoiDung.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], NguoiDung.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], NguoiDung.prototype, "ho_ten", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NguoiDung.prototype, "avatar_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'User' }),
    __metadata("design:type", String)
], NguoiDung.prototype, "vai_tro_he_thong", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], NguoiDung.prototype, "ngay_tao", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lichsu_chamdiem_entity_1.LichSuChamDiem, (history) => history.nguoi_cham),
    __metadata("design:type", Array)
], NguoiDung.prototype, "lich_su_cham", void 0);
exports.NguoiDung = NguoiDung = __decorate([
    (0, typeorm_1.Entity)('td_nguoidung')
], NguoiDung);
//# sourceMappingURL=nguoidung.entity.js.map