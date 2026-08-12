import { Lop } from './lop.entity';
export declare class PhanQuyen {
    phan_quyen_id: number;
    lop_id: number;
    vai_tro_thi_dua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho';
    duoc_cham_to_vien: boolean;
    duoc_cham_to_truong: boolean;
    duoc_cham_ngoai_to: boolean;
    duoc_duyet_huy_diem: boolean;
    lop: Lop;
}
