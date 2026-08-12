import { HocSinh } from './hocsinh.entity';
export declare class TongHopThang {
    tong_hop_thang_id: number;
    hoc_sinh_id: number;
    thang: number;
    nam: number;
    diem_trung_binh: number;
    xep_loai: string;
    ngay_tong_hop: Date;
    hoc_sinh: HocSinh;
}
