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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HocSinhController = void 0;
const common_1 = require("@nestjs/common");
const hoc_sinh_service_1 = require("./hoc-sinh.service");
const supabase_auth_guard_1 = require("../../common/guards/supabase-auth.guard");
let HocSinhController = class HocSinhController {
    hocSinhService;
    constructor(hocSinhService) {
        this.hocSinhService = hocSinhService;
    }
    findByLop(lopId) {
        return this.hocSinhService.findByLop(lopId);
    }
    create(body) {
        return this.hocSinhService.create(body);
    }
    update(id, body) {
        return this.hocSinhService.update(id, body);
    }
    remove(id) {
        return this.hocSinhService.remove(id);
    }
    importList(body) {
        return this.hocSinhService.importList(body.lop_id, body.hoc_sinh_list);
    }
    updateRole(id, vaiTro) {
        return this.hocSinhService.updateVaiTro(id, vaiTro);
    }
};
exports.HocSinhController = HocSinhController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('lop_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HocSinhController.prototype, "findByLop", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HocSinhController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], HocSinhController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HocSinhController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HocSinhController.prototype, "importList", null);
__decorate([
    (0, common_1.Patch)(':id/role'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('vai_tro_thi_dua')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], HocSinhController.prototype, "updateRole", null);
exports.HocSinhController = HocSinhController = __decorate([
    (0, common_1.Controller)('students'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [hoc_sinh_service_1.HocSinhService])
], HocSinhController);
//# sourceMappingURL=hoc-sinh.controller.js.map