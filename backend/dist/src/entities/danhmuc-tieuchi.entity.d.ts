import { LichSuChamDiem } from './lichsu-chamdiem.entity';
export declare class DanhMucTieuChi {
    tieu_chi_id: number;
    ten_tieu_chi: string;
    nhom_tieu_chi: string;
    loai: 'Cong' | 'Tru';
    so_diem: number;
    trang_thai: boolean;
    lich_su_cham: LichSuChamDiem[];
}
