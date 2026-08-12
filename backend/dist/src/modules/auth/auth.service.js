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
            let nguoiDung = await this.nguoiDungRepo.findOne({ where: { user_id: userId } });
            let hocSinh = await this.hocSinhRepo.findOne({
                where: { email },
                relations: ['to', 'lop'],
            });
            let lopGvcn = await this.lopRepo.findOne({ where: { gvcn_email: email } });
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
        else if (email === 'gvcn10a1@thiduahs.com') {
            hoTen = 'Thầy/Cô Chủ Nhiệm (10A1)';
        }
        else if (email === 'loptruong@thiduahs.com') {
            vaiTroThiDua = 'LopTruong';
            hoTen = 'Lớp Trưởng (10A1)';
        }
        else if (email === 'totruong1@thiduahs.com') {
            vaiTroThiDua = 'ToTruong';
            hoTen = 'Tổ Trưởng (Tổ 1 - 10A1)';
        }
        else if (email === 'hocsinh1@thiduahs.com') {
            vaiTroThiDua = 'HocSinh';
            hoTen = 'Học Sinh (Tổ 1 - 10A1)';
        }
        return {
            user_id: userId,
            email,
            ho_ten: hoTen,
            avatar_url: 'https://via.placeholder.com/150',
            vai_tro_he_thong: vaiTroHeThong,
            hoc_sinh: (email === 'admin@thiduahs.com' || email === 'gvcn10a1@thiduahs.com') ? null : {
                hoc_sinh_id: 1,
                lop_id: 1,
                to_id: 1,
                ho_ten: hoTen,
                ma_hoc_sinh: 'HS001',
                vai_tro_thi_dua: vaiTroThiDua,
                ten_to: 'Tổ 1',
                ten_lop: '10A1',
            },
            gvcn_lop: email === 'gvcn10a1@thiduahs.com' ? {
                lop_id: 1,
                ten_lop: '10A1',
            } : null,
        };
    }
    async setVaiTroHeThong(userId, vaiTro) {
        await this.nguoiDungRepo.update({ user_id: userId }, { vai_tro_he_thong: vaiTro });
        return { message: `Đã cập nhật vai trò hệ thống thành ${vaiTro}` };
    }
    async mockLogin(email) {
        try {
            const getMockUuid = (e) => {
                switch (e) {
                    case 'admin@thiduahs.com': return '00000000-0000-4000-a000-000000000001';
                    case 'loptruong@thiduahs.com': return '00000000-0000-4000-a000-000000000002';
                    case 'totruong1@thiduahs.com': return '00000000-0000-4000-a000-000000000003';
                    case 'hocsinh1@thiduahs.com': return '00000000-0000-4000-a000-000000000004';
                    case 'gvcn10a1@thiduahs.com': return '00000000-0000-4000-a000-000000000005';
                    default: return '11111111-1111-4111-a111-111111111111';
                }
            };
            const userId = getMockUuid(email);
            let user = await this.nguoiDungRepo.findOne({ where: { user_id: userId } });
            if (!user) {
                const vaiTroHeThong = email === 'admin@thiduahs.com' ? 'Admin' : 'User';
                const hoTen = email === 'admin@thiduahs.com' ? 'Admin Kiểm Thử' : email.split('@')[0].toUpperCase();
                await this.nguoiDungRepo.save({
                    user_id: userId,
                    email,
                    ho_ten: hoTen,
                    vai_tro_he_thong: vaiTroHeThong,
                });
            }
            if (email !== 'admin@thiduahs.com') {
                let nienHocId = 1;
                const nienHoc = await this.nguoiDungRepo.query("SELECT nien_hoc_id FROM td_nienhoc LIMIT 1");
                if (nienHoc.length === 0) {
                    const res = await this.nguoiDungRepo.query("INSERT INTO td_nienhoc (ten_nien_hoc, ngay_bat_dau, ngay_ket_thuc, trang_thai) VALUES ('2026-2027', '2026-09-05', '2027-05-30', true) RETURNING nien_hoc_id");
                    nienHocId = res[0].nien_hoc_id;
                }
                else {
                    nienHocId = nienHoc[0].nien_hoc_id;
                }
                const hocKy = await this.nguoiDungRepo.query("SELECT hoc_ky_id FROM td_hocky LIMIT 1");
                if (hocKy.length === 0) {
                    await this.nguoiDungRepo.query(`INSERT INTO td_hocky (nien_hoc_id, ten_hoc_ky, trang_thai) VALUES (${nienHocId}, 'Học kỳ 1', true)`);
                }
                let lopId = 1;
                const lop = await this.nguoiDungRepo.query("SELECT lop_id FROM td_lop LIMIT 1");
                if (lop.length === 0) {
                    const res = await this.nguoiDungRepo.query(`INSERT INTO td_lop (nien_hoc_id, ten_lop, khoi, gvcn_email) VALUES (${nienHocId}, '10A1', 10, 'gvcn10a1@thiduahs.com') RETURNING lop_id`);
                    lopId = res[0].lop_id;
                }
                else {
                    lopId = lop[0].lop_id;
                }
                let toId = 1;
                const to = await this.nguoiDungRepo.query("SELECT to_id FROM td_to LIMIT 1");
                if (to.length === 0) {
                    const res = await this.nguoiDungRepo.query(`INSERT INTO td_to (lop_id, ten_to) VALUES (${lopId}, 'Tổ 1') RETURNING to_id`);
                    toId = res[0].to_id;
                }
                else {
                    toId = to[0].to_id;
                }
                if (email !== 'gvcn10a1@thiduahs.com') {
                    const existingHocSinh = await this.hocSinhRepo.findOne({ where: { email } });
                    if (!existingHocSinh) {
                        let vaiTroThiDua = 'HocSinh';
                        let hoTen = 'Học Sinh Demo';
                        let maHocSinh = 'HS001';
                        if (email === 'loptruong@thiduahs.com') {
                            vaiTroThiDua = 'LopTruong';
                            hoTen = 'Lớp Trưởng Demo';
                            maHocSinh = 'HS002';
                        }
                        else if (email === 'totruong1@thiduahs.com') {
                            vaiTroThiDua = 'ToTruong';
                            hoTen = 'Tổ Trưởng Demo';
                            maHocSinh = 'HS003';
                        }
                        await this.hocSinhRepo.save({
                            lop_id: lopId,
                            to_id: toId,
                            ho_ten: hoTen,
                            email,
                            ma_hoc_sinh: maHocSinh,
                            vai_tro_thi_dua: vaiTroThiDua,
                        });
                        const pq = await this.nguoiDungRepo.query(`SELECT phan_quyen_id FROM td_phanquyen WHERE lop_id = ${lopId}`);
                        if (pq.length === 0) {
                            await this.nguoiDungRepo.query(`
                INSERT INTO td_phanquyen (lop_id, vai_tro_thi_dua, duoc_cham_to_vien, duoc_cham_to_truong, duoc_cham_ngoai_to, duoc_duyet_huy_diem) VALUES
                (${lopId}, 'LopTruong', true, true, true, true),
                (${lopId}, 'LopPho', true, true, true, false),
                (${lopId}, 'ToTruong', true, false, false, false),
                (${lopId}, 'ToPho', true, false, false, false)
              `);
                        }
                    }
                }
            }
        }
        catch (err) {
            console.error('Lỗi scaffold mock user:', err);
        }
        return {
            access_token: `mock-token-${email}`,
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