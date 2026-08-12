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
exports.To = void 0;
const typeorm_1 = require("typeorm");
const lop_entity_1 = require("./lop.entity");
const hocsinh_entity_1 = require("./hocsinh.entity");
let To = class To {
    to_id;
    lop_id;
    ten_to;
    lop;
    hoc_sinh;
};
exports.To = To;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], To.prototype, "to_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], To.prototype, "lop_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], To.prototype, "ten_to", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lop_entity_1.Lop, (lop) => lop.to, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'lop_id' }),
    __metadata("design:type", lop_entity_1.Lop)
], To.prototype, "lop", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hocsinh_entity_1.HocSinh, (hs) => hs.to),
    __metadata("design:type", Array)
], To.prototype, "hoc_sinh", void 0);
exports.To = To = __decorate([
    (0, typeorm_1.Entity)('td_to')
], To);
//# sourceMappingURL=to.entity.js.map