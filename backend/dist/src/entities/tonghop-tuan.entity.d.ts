import { HocSinh } from './hocsinh.entity';
import { HocKy } from './hocky.entity';
export declare class TongHopTuan {
    tong_hop_tuan_id: number;
    hoc_sinh_id: number;
    hoc_ky_id: number;
    tuan_thu: number;
    diem_mac_dinh: number;
    tong_diem_cong: number;
    tong_diem_tru: number;
    diem_cuoi_cung: number;
    ngay_chot: Date;
    hoc_sinh: HocSinh;
    hoc_ky: HocKy;
}
