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
var ChamDiemService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChamDiemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const lichsu_chamdiem_entity_1 = require("../../entities/lichsu-chamdiem.entity");
const hocsinh_entity_1 = require("../../entities/hocsinh.entity");
const danhmuc_tieuchi_entity_1 = require("../../entities/danhmuc-tieuchi.entity");
const phanquyen_entity_1 = require("../../entities/phanquyen.entity");
const tonghop_tuan_entity_1 = require("../../entities/tonghop-tuan.entity");
const nguoidung_entity_1 = require("../../entities/nguoidung.entity");
let ChamDiemService = ChamDiemService_1 = class ChamDiemService {
    lichSuRepo;
    hocSinhRepo;
    tieuChiRepo;
    phanQuyenRepo;
    tongHopTuanRepo;
    nguoiDungRepo;
    logger = new common_1.Logger(ChamDiemService_1.name);
    constructor(lichSuRepo, hocSinhRepo, tieuChiRepo, phanQuyenRepo, tongHopTuanRepo, nguoiDungRepo) {
        this.lichSuRepo = lichSuRepo;
        this.hocSinhRepo = hocSinhRepo;
        this.tieuChiRepo = tieuChiRepo;
        this.phanQuyenRepo = phanQuyenRepo;
        this.tongHopTuanRepo = tongHopTuanRepo;
        this.nguoiDungRepo = nguoiDungRepo;
    }
    getTuanThu(date) {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
        return Math.ceil((days + startOfYear.getDay() + 1) / 7);
    }
    isTuanDaChot(ngayViPham) {
        const now = new Date();
        const dayOfWeek = ngayViPham.getDay();
        const diffToFriday = (5 - dayOfWeek + 7) % 7;
        const friday = new Date(ngayViPham);
        friday.setDate(ngayViPham.getDate() + diffToFriday);
        friday.setHours(22, 0, 0, 0);
        return now > friday;
    }
    async ghi(userId, body) {
        const ngayViPham = new Date(body.ngay_vi_pham);
        if (this.isTuanDaChot(ngayViPham)) {
            throw new common_1.BadRequestException('Tuần học đã bị chốt lúc 22h00 thứ Sáu. Không thể chấm điểm cho ngày này.');
        }
        const nguoiCham = await this.nguoiDungRepo.findOne({ where: { user_id: userId } });
        if (!nguoiCham)
            throw new common_1.NotFoundException('Không tìm thấy thông tin người dùng.');
        const hocSinhBiCham = await this.hocSinhRepo.findOne({ where: { hoc_sinh_id: body.hoc_sinh_id } });
        if (!hocSinhBiCham)
            throw new common_1.NotFoundException('Không tìm thấy học sinh bị chấm điểm.');
        if (nguoiCham.vai_tro_he_thong !== 'Admin') {
            const lopGvcn = await this.hocSinhRepo.query("SELECT lop_id FROM td_lop WHERE gvcn_email = $1 AND lop_id = $2", [nguoiCham.email, hocSinhBiCham.lop_id]);
            const isGvcnCuaLop = lopGvcn.length > 0;
            if (!isGvcnCuaLop) {
                const hocSinhCham = await this.hocSinhRepo.findOne({ where: { email: nguoiCham.email } });
                if (!hocSinhCham) {
                    throw new common_1.ForbiddenException('Bạn không có quyền chấm điểm thi đua cho lớp này.');
                }
                if (hocSinhCham.vai_tro_thi_dua === 'HocSinh') {
                    throw new common_1.ForbiddenException('Học sinh thường không có quyền chấm điểm thi đua.');
                }
                if (hocSinhCham.lop_id !== hocSinhBiCham.lop_id) {
                    throw new common_1.ForbiddenException('Bạn chỉ được phép chấm điểm cho học sinh trong lớp của mình.');
                }
            }
        }
        const tieuChi = await this.tieuChiRepo.findOne({ where: { tieu_chi_id: body.tieu_chi_id } });
        if (!tieuChi)
            throw new common_1.NotFoundException('Không tìm thấy tiêu chí thi đua.');
        const tuanThu = this.getTuanThu(ngayViPham);
        const record = this.lichSuRepo.create({
            nguoi_cham_id: userId,
            hoc_sinh_id: body.hoc_sinh_id,
            tieu_chi_id: body.tieu_chi_id,
            so_diem_thuc_te: tieuChi.so_diem,
            ngay_vi_pham: body.ngay_vi_pham,
            mo_ta: body.mo_ta,
            hinh_anh_minh_chung: body.hinh_anh_minh_chung,
            tuan_thu: tuanThu,
            trang_thai: 'HieuLuc',
        });
        return this.lichSuRepo.save(record);
    }
    findHistory(filters) {
        const query = this.lichSuRepo.createQueryBuilder('ls')
            .leftJoinAndSelect('ls.hoc_sinh', 'hs')
            .leftJoinAndSelect('ls.tieu_chi', 'tc')
            .leftJoinAndSelect('ls.nguoi_cham', 'nd');
        if (filters.hoc_sinh_id)
            query.andWhere('ls.hoc_sinh_id = :id', { id: filters.hoc_sinh_id });
        if (filters.tuan_thu)
            query.andWhere('ls.tuan_thu = :tuan', { tuan: filters.tuan_thu });
        return query.orderBy('ls.ngay_cham', 'DESC').getMany();
    }
    async huyDiem(lichSuId) {
        const record = await this.lichSuRepo.findOne({ where: { lich_su_id: lichSuId } });
        if (!record)
            throw new common_1.NotFoundException('Không tìm thấy bản ghi chấm điểm.');
        if (this.isTuanDaChot(new Date(record.ngay_vi_pham))) {
            throw new common_1.BadRequestException('Tuần đã chốt, không thể hủy điểm.');
        }
        await this.lichSuRepo.update({ lich_su_id: lichSuId }, { trang_thai: 'BiHuy' });
        return { message: 'Đã hủy điểm thành công' };
    }
    async chotDiemTuan() {
        this.logger.log('🔒 Bắt đầu chốt điểm thi đua tuần...');
        const hocSinhList = await this.hocSinhRepo.find();
        const now = new Date();
        const tuanThu = this.getTuanThu(now);
        for (const hs of hocSinhList) {
            const lichSuTuan = await this.lichSuRepo.find({
                where: { hoc_sinh_id: hs.hoc_sinh_id, tuan_thu: tuanThu, trang_thai: 'HieuLuc' },
                relations: ['tieu_chi'],
            });
            let tongCong = 0;
            let tongTru = 0;
            for (const ls of lichSuTuan) {
                if (ls.tieu_chi.loai === 'Cong')
                    tongCong += Number(ls.so_diem_thuc_te);
                else
                    tongTru += Number(ls.so_diem_thuc_te);
            }
            const diemCuoiCung = 100.0 + tongCong - tongTru;
            await this.tongHopTuanRepo.upsert({
                hoc_sinh_id: hs.hoc_sinh_id,
                hoc_ky_id: 1,
                tuan_thu: tuanThu,
                diem_mac_dinh: 100.0,
                tong_diem_cong: tongCong,
                tong_diem_tru: tongTru,
                diem_cuoi_cung: diemCuoiCung,
            }, ['hoc_sinh_id', 'hoc_ky_id', 'tuan_thu']);
        }
        this.logger.log(`✅ Hoàn thành chốt điểm tuần ${tuanThu} cho ${hocSinhList.length} học sinh.`);
    }
};
exports.ChamDiemService = ChamDiemService;
__decorate([
    (0, schedule_1.Cron)('0 15 * * 5', { name: 'chot-diem-tuan', timeZone: 'UTC' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChamDiemService.prototype, "chotDiemTuan", null);
exports.ChamDiemService = ChamDiemService = ChamDiemService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lichsu_chamdiem_entity_1.LichSuChamDiem)),
    __param(1, (0, typeorm_1.InjectRepository)(hocsinh_entity_1.HocSinh)),
    __param(2, (0, typeorm_1.InjectRepository)(danhmuc_tieuchi_entity_1.DanhMucTieuChi)),
    __param(3, (0, typeorm_1.InjectRepository)(phanquyen_entity_1.PhanQuyen)),
    __param(4, (0, typeorm_1.InjectRepository)(tonghop_tuan_entity_1.TongHopTuan)),
    __param(5, (0, typeorm_1.InjectRepository)(nguoidung_entity_1.NguoiDung)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChamDiemService);
//# sourceMappingURL=cham-diem.service.js.map