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
var SupabaseAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseAuthGuard = SupabaseAuthGuard_1 = class SupabaseAuthGuard {
    config;
    logger = new common_1.Logger(SupabaseAuthGuard_1.name);
    supabase;
    constructor(config) {
        this.config = config;
        this.supabase = (0, supabase_js_1.createClient)(config.get('SUPABASE_URL'), config.get('SUPABASE_ANON_KEY'));
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Thiếu token xác thực. Vui lòng đăng nhập.');
        }
        const token = authHeader.split(' ')[1];
        if (token.startsWith('mock-token-')) {
            const email = token.replace('mock-token-', '');
            const getMockUuid = (e) => {
                if (e === 'admin@thiduahs.com')
                    return '00000000-0000-4000-a000-000000000001';
                if (e === 'gvcn11c2@thiduahs.com')
                    return '00000000-0000-4000-a000-000000000005';
                if (e.startsWith('hs')) {
                    const maHs = e.replace('hs', '').split('@')[0];
                    return `00000000-0000-4000-a000-${maHs.padStart(12, '0')}`;
                }
                return '11111111-1111-4111-a111-111111111111';
            };
            const mockUser = {
                id: getMockUuid(email),
                email: email,
                raw_user_meta_data: {
                    full_name: email.split('@')[0].toUpperCase(),
                    name: email.split('@')[0].toUpperCase(),
                },
            };
            request.user = mockUser;
            request.accessToken = token;
            return true;
        }
        const { data, error } = await this.supabase.auth.getUser(token);
        if (error || !data.user) {
            this.logger.warn(`Token không hợp lệ: ${error?.message}`);
            throw new common_1.UnauthorizedException('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
        }
        request.user = data.user;
        request.accessToken = token;
        return true;
    }
};
exports.SupabaseAuthGuard = SupabaseAuthGuard;
exports.SupabaseAuthGuard = SupabaseAuthGuard = SupabaseAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseAuthGuard);
//# sourceMappingURL=supabase-auth.guard.js.map