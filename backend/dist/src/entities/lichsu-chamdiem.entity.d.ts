import { NguoiDung } from './nguoidung.entity';
import { HocSinh } from './hocsinh.entity';
import { DanhMucTieuChi } from './danhmuc-tieuchi.entity';
export declare class LichSuChamDiem {
    lich_su_id: string;
    nguoi_cham_id: string;
    hoc_sinh_id: number;
    tieu_chi_id: number;
    so_diem_thuc_te: number;
    ngay_vi_pham: string;
    ngay_cham: Date;
    mo_ta: string;
    hinh_anh_minh_chung: string;
    tuan_thu: number;
    trang_thai: 'HieuLuc' | 'BiHuy';
    nguoi_cham: NguoiDung;
    hoc_sinh: HocSinh;
    tieu_chi: DanhMucTieuChi;
}
