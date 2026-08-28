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
exports.TieuChiController = void 0;
const common_1 = require("@nestjs/common");
const tieu_chi_service_1 = require("./tieu-chi.service");
const supabase_auth_guard_1 = require("../../common/guards/supabase-auth.guard");
let TieuChiController = class TieuChiController {
    tieuChiService;
    constructor(tieuChiService) {
        this.tieuChiService = tieuChiService;
    }
    findAll(showAll) {
        return this.tieuChiService.findAll(showAll === 'true');
    }
    create(body) {
        return this.tieuChiService.create(body);
    }
    update(id, body) {
        return this.tieuChiService.update(id, body);
    }
    remove(id) {
        return this.tieuChiService.remove(id);
    }
};
exports.TieuChiController = TieuChiController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('showAll')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TieuChiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TieuChiController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], TieuChiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TieuChiController.prototype, "remove", null);
exports.TieuChiController = TieuChiController = __decorate([
    (0, common_1.Controller)('criteria'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [tieu_chi_service_1.TieuChiService])
], TieuChiController);
//# sourceMappingURL=tieu-chi.controller.js.map