import { Repository } from 'typeorm';
import { LichSuChamDiem } from '../../entities/lichsu-chamdiem.entity';
import { HocSinh } from '../../entities/hocsinh.entity';
import { DanhMucTieuChi } from '../../entities/danhmuc-tieuchi.entity';
import { PhanQuyen } from '../../entities/phanquyen.entity';
import { TongHopTuan } from '../../entities/tonghop-tuan.entity';
import { NguoiDung } from '../../entities/nguoidung.entity';
export declare class ChamDiemService {
    private lichSuRepo;
    private hocSinhRepo;
    private tieuChiRepo;
    private phanQuyenRepo;
    private tongHopTuanRepo;
    private nguoiDungRepo;
    private readonly logger;
    constructor(lichSuRepo: Repository<LichSuChamDiem>, hocSinhRepo: Repository<HocSinh>, tieuChiRepo: Repository<DanhMucTieuChi>, phanQuyenRepo: Repository<PhanQuyen>, tongHopTuanRepo: Repository<TongHopTuan>, nguoiDungRepo: Repository<NguoiDung>);
    private getTuanThu;
    private isTuanDaChot;
    ghi(userId: string, body: {
        hoc_sinh_id: number;
        tieu_chi_id: number;
        ngay_vi_pham: string;
        mo_ta?: string;
        hinh_anh_minh_chung?: string;
    }): Promise<LichSuChamDiem>;
    findHistory(filters: {
        hoc_sinh_id?: number;
        lop_id?: number;
        tuan_thu?: number;
    }): Promise<LichSuChamDiem[]>;
    huyDiem(lichSuId: string): Promise<{
        message: string;
    }>;
    chotDiemTuan(): Promise<void>;
}
