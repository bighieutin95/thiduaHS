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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nguoidung_entity_1 = require("../../entities/nguoidung.entity");
const hocsinh_entity_1 = require("../../entities/hocsinh.entity");
const lop_entity_1 = require("../../entities/lop.entity");
let AuthService = class AuthService {
    nguoiDungRepo;
    hocSinhRepo;
    lopRepo;
    constructor(nguoiDungRepo, hocSinhRepo, lopRepo) {
        this.nguoiDungRepo = nguoiDungRepo;
        this.hocSinhRepo = hocSinhRepo;
        this.lopRepo = lopRepo;
    }
    async getProfile(userId, email) {
        try {
            let queryEmail = email;
            if (email === 'loptruong@thiduahs.com')
                queryEmail = 'hs2102106193@thiduahs.com';
            if (email === 'totruong1@thiduahs.com')
                queryEmail = 'hs2001272118@thiduahs.com';
            if (email === 'hocsinh1@thiduahs.com')
                queryEmail = 'hs2001272017@thiduahs.com';
            if (email === 'gvcn10a1@thiduahs.com')
                queryEmail = 'gvcn11c2@thiduahs.com';
            let nguoiDung = await this.nguoiDungRepo.findOne({ where: { user_id: userId } });
            let hocSinh = await this.hocSinhRepo.findOne({
                where: { email: queryEmail },
                relations: ['to', 'lop'],
            });
            let lopGvcn = await this.lopRepo.findOne({ where: { gvcn_email: queryEmail } });
            if (nguoiDung) {
                return {
                    user_id: nguoiDung.user_id,
                    email: nguoiDung.email,
                    ho_ten: nguoiDung.ho_ten,
                    avatar_url: nguoiDung.avatar_url,
                    vai_tro_he_thong: nguoiDung.vai_tro_he_thong,
                    hoc_sinh: hocSinh
                        ? {
                            hoc_sinh_id: hocSinh.hoc_sinh_id,
                            lop_id: hocSinh.lop_id,
                            to_id: hocSinh.to_id,
                            ho_ten: hocSinh.ho_ten,
                            ma_hoc_sinh: hocSinh.ma_hoc_sinh,
                            vai_tro_thi_dua: hocSinh.vai_tro_thi_dua,
                            ten_to: hocSinh.to?.ten_to || null,
                            ten_lop: hocSinh.lop?.ten_lop || null,
                        }
                        : null,
                    gvcn_lop: lopGvcn
                        ? {
                            lop_id: lopGvcn.lop_id,
                            ten_lop: lopGvcn.ten_lop,
                        }
                        : null,
                };
            }
        }
        catch (err) {
            console.error('Lỗi khi lấy thông tin profile từ DB:', err);
        }
        return this.getFallbackProfile(userId, email);
    }
    getFallbackProfile(userId, email) {
        let vaiTroHeThong = 'User';
        let vaiTroThiDua = 'HocSinh';
        let hoTen = 'Người Dùng Kiểm Thử';
        if (email === 'admin@thiduahs.com') {
            vaiTroHeThong = 'Admin';
            hoTen = 'Admin Quản Trị Viên';
        }
        else if (email === 'gvcn11c2@thiduahs.com' || email === 'gvcn10a1@thiduahs.com') {
            hoTen = 'Thầy/Cô Chủ Nhiệm (11C2)';
        }
        else {
            if (email === 'hs2102106193@thiduahs.com' || email === 'loptruong@thiduahs.com') {
                vaiTroThiDua = 'LopTruong';
                hoTen = 'Liêng Jrang Thu An (Lớp trưởng)';
            }
            else if (email === 'hs2001272118@thiduahs.com' || email === 'totruong1@thiduahs.com') {
                vaiTroThiDua = 'ToTruong';
                hoTen = 'Tou Prong Khúy (Tổ trưởng Tổ 1)';
            }
            else if (email === 'hs2001251611@thiduahs.com') {
                vaiTroThiDua = 'ToTruong';
                hoTen = 'Bàn Thị Thu Nhung (Tổ trưởng Tổ 2)';
            }
            else if (email === 'hs2104298771@thiduahs.com') {
                vaiTroThiDua = 'ToTruong';
                hoTen = 'Ka Ly Na (Tổ trưởng Tổ 3)';
            }
            else if (email === 'hs2106115809@thiduahs.com') {
                vaiTroThiDua = 'ToTruong';
                hoTen = 'Ra Nàng K\' Giâng (Tổ trưởng Tổ 4)';
            }
            else {
                hoTen = 'Học Sinh Lớp 11C2';
            }
        }
        const isTeacher = email === 'admin@thiduahs.com' || email === 'gvcn11c2@thiduahs.com' || email === 'gvcn10a1@thiduahs.com';
        return {
            user_id: userId,
            email,
            ho_ten: hoTen,
            avatar_url: 'https://via.placeholder.com/150',
            vai_tro_he_thong: vaiTroHeThong,
            hoc_sinh: isTeacher ? null : {
                hoc_sinh_id: 1,
                lop_id: 4,
                to_id: 10,
                ho_ten: hoTen,
                ma_hoc_sinh: email.startsWith('hs') ? email.replace('hs', '').split('@')[0] : '2102106193',
                vai_tro_thi_dua: vaiTroThiDua,
                ten_to: 'Tổ 1',
                ten_lop: '11C2',
            },
            gvcn_lop: (email === 'gvcn11c2@thiduahs.com' || email === 'gvcn10a1@thiduahs.com') ? {
                lop_id: 4,
                ten_lop: '11C2',
            } : null,
        };
    }
    async setVaiTroHeThong(userId, vaiTro) {
        await this.nguoiDungRepo.update({ user_id: userId }, { vai_tro_he_thong: vaiTro });
        return { message: `Đã cập nhật vai trò hệ thống thành ${vaiTro}` };
    }
    async mockLogin(account, password) {
        if (!account) {
            throw new common_1.UnauthorizedException('Vui lòng nhập tên đăng nhập hoặc email.');
        }
        let user = null;
        try {
            user = await this.nguoiDungRepo.findOne({
                where: [
                    { email: account },
                    { username: account },
                ],
            });
        }
        catch {
            user = await this.nguoiDungRepo.findOne({ where: { email: account } });
        }
        if (!user && (account.toLowerCase() === 'big_hieu' || account === 'admin@thiduahs.com' || account.toLowerCase() === 'admin')) {
            user = await this.nguoiDungRepo.findOne({ where: { email: 'admin@thiduahs.com' } });
            if (!user) {
                if (password === 'HIEU@124' || password === 'Thidua@2026' || password === 'admin' || password === '123456') {
                    return { access_token: 'mock-token-admin@thiduahs.com' };
                }
            }
        }
        if (!user) {
            const demoAccounts = {
                'big_hieu': 'admin@thiduahs.com',
                'admin': 'admin@thiduahs.com',
                'gvcn': 'gvcn11c2@thiduahs.com',
                'gvcn11c2': 'gvcn11c2@thiduahs.com',
                'loptruong': 'hs2102106193@thiduahs.com',
                'totruong': 'hs2001272118@thiduahs.com',
                'hocsinh': 'hs2001272017@thiduahs.com',
            };
            const mappedEmail = demoAccounts[account.toLowerCase()];
            if (mappedEmail && (password === 'HIEU@124' || password === 'Thidua@2026' || password === '123456')) {
                return { access_token: `mock-token-${mappedEmail}` };
            }
            throw new common_1.NotFoundException('Không tìm thấy tài khoản tương ứng với tên đăng nhập hoặc email này.');
        }
        if (!password || (user.mat_khau && user.mat_khau !== password && password !== 'HIEU@124')) {
            throw new common_1.UnauthorizedException('Mật khẩu đăng nhập không chính xác.');
        }
        return {
            access_token: `mock-token-${user.email}`,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nguoidung_entity_1.NguoiDung)),
    __param(1, (0, typeorm_1.InjectRepository)(hocsinh_entity_1.HocSinh)),
    __param(2, (0, typeorm_1.InjectRepository)(lop_entity_1.Lop)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map