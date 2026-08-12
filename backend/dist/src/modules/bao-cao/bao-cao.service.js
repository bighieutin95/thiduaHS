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
exports.BaoCaoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tonghop_tuan_entity_1 = require("../../entities/tonghop-tuan.entity");
const tonghop_thang_entity_1 = require("../../entities/tonghop-thang.entity");
const hocsinh_entity_1 = require("../../entities/hocsinh.entity");
const lichsu_chamdiem_entity_1 = require("../../entities/lichsu-chamdiem.entity");
let BaoCaoService = class BaoCaoService {
    tongHopTuanRepo;
    tongHopThangRepo;
    hocSinhRepo;
    lichSuRepo;
    constructor(tongHopTuanRepo, tongHopThangRepo, hocSinhRepo, lichSuRepo) {
        this.tongHopTuanRepo = tongHopTuanRepo;
        this.tongHopThangRepo = tongHopThangRepo;
        this.hocSinhRepo = hocSinhRepo;
        this.lichSuRepo = lichSuRepo;
    }
    async baoTuanTheoLop(lopId, tuanThu) {
        return this.tongHopTuanRepo.createQueryBuilder('t')
            .leftJoinAndSelect('t.hoc_sinh', 'hs')
            .where('hs.lop_id = :lopId', { lopId })
            .andWhere('t.tuan_thu = :tuan', { tuan: tuanThu })
            .orderBy('t.diem_cuoi_cung', 'DESC')
            .getMany();
    }
    async baoTuanRealtime(lopId, tuanThu) {
        const students = await this.hocSinhRepo.find({
            where: { lop_id: lopId },
            relations: ['to'],
        });
        const history = await this.lichSuRepo.find({
            where: { tuan_thu: tuanThu, trang_thai: 'HieuLuc' },
            relations: ['tieu_chi'],
        });
        return students.map((hs) => {
            const hsHistory = history.filter((h) => h.hoc_sinh_id === hs.hoc_sinh_id);
            let tongCong = 0;
            let tongTru = 0;
            for (const h of hsHistory) {
                if (h.tieu_chi?.loai === 'Cong') {
                    tongCong += Number(h.so_diem_thuc_te);
                }
                else {
                    tongTru += Number(h.so_diem_thuc_te);
                }
            }
            return {
                hoc_sinh: hs,
                tuan_thu: tuanThu,
                diem_mac_dinh: 100.0,
                tong_diem_cong: tongCong,
                tong_diem_tru: tongTru,
                diem_cuoi_cung: 100.0 + tongCong - tongTru,
            };
        }).sort((a, b) => b.diem_cuoi_cung - a.diem_cuoi_cung);
    }
    async baoThangTheoLop(lopId, thang, nam) {
        return this.tongHopThangRepo.createQueryBuilder('t')
            .leftJoinAndSelect('t.hoc_sinh', 'hs')
            .where('hs.lop_id = :lopId', { lopId })
            .andWhere('t.thang = :thang', { thang })
            .andWhere('t.nam = :nam', { nam })
            .orderBy('t.diem_trung_binh', 'DESC')
            .getMany();
    }
};
exports.BaoCaoService = BaoCaoService;
exports.BaoCaoService = BaoCaoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tonghop_tuan_entity_1.TongHopTuan)),
    __param(1, (0, typeorm_1.InjectRepository)(tonghop_thang_entity_1.TongHopThang)),
    __param(2, (0, typeorm_1.InjectRepository)(hocsinh_entity_1.HocSinh)),
    __param(3, (0, typeorm_1.InjectRepository)(lichsu_chamdiem_entity_1.LichSuChamDiem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BaoCaoService);
//# sourceMappingURL=bao-cao.service.js.map