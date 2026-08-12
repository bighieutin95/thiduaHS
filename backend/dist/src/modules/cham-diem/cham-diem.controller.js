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
exports.ChamDiemController = void 0;
const common_1 = require("@nestjs/common");
const cham_diem_service_1 = require("./cham-diem.service");
const supabase_auth_guard_1 = require("../../common/guards/supabase-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ChamDiemController = class ChamDiemController {
    chamDiemService;
    constructor(chamDiemService) {
        this.chamDiemService = chamDiemService;
    }
    grade(user, body) {
        return this.chamDiemService.ghi(user.id, body);
    }
    history(query) {
        return this.chamDiemService.findHistory(query);
    }
    cancel(id) {
        return this.chamDiemService.huyDiem(id);
    }
};
exports.ChamDiemController = ChamDiemController;
__decorate([
    (0, common_1.Post)('grade'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChamDiemController.prototype, "grade", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChamDiemController.prototype, "history", null);
__decorate([
    (0, common_1.Put)('history/:id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChamDiemController.prototype, "cancel", null);
exports.ChamDiemController = ChamDiemController = __decorate([
    (0, common_1.Controller)('emulation'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [cham_diem_service_1.ChamDiemService])
], ChamDiemController);
//# sourceMappingURL=cham-diem.controller.js.map