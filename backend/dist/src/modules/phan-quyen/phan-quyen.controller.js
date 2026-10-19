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
exports.PhanQuyenController = void 0;
const common_1 = require("@nestjs/common");
const phan_quyen_service_1 = require("./phan-quyen.service");
const supabase_auth_guard_1 = require("../../common/guards/supabase-auth.guard");
let PhanQuyenController = class PhanQuyenController {
    phanQuyenService;
    constructor(phanQuyenService) {
        this.phanQuyenService = phanQuyenService;
    }
    findByLop(classId) {
        return this.phanQuyenService.findByLop(classId);
    }
    update(classId, body) {
        return this.phanQuyenService.updateByLop(classId, body);
    }
    getAllUsers() {
        return this.phanQuyenService.getAllUsers();
    }
    updateUser(body) {
        return this.phanQuyenService.updateUser(body);
    }
    updatePassword(email, matKhau) {
        return this.phanQuyenService.updatePassword(email, matKhau);
    }
};
exports.PhanQuyenController = PhanQuyenController;
__decorate([
    (0, common_1.Get)(':classId'),
    __param(0, (0, common_1.Param)('classId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhanQuyenController.prototype, "findByLop", null);
__decorate([
    (0, common_1.Put)(':classId'),
    __param(0, (0, common_1.Param)('classId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", void 0)
], PhanQuyenController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('users/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhanQuyenController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Put)('update-user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhanQuyenController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Put)('update-password'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PhanQuyenController.prototype, "updatePassword", null);
exports.PhanQuyenController = PhanQuyenController = __decorate([
    (0, common_1.Controller)('permissions'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [phan_quyen_service_1.PhanQuyenService])
], PhanQuyenController);
//# sourceMappingURL=phan-quyen.controller.js.map