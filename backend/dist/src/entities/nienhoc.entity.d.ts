import { Lop } from './lop.entity';
import { HocKy } from './hocky.entity';
export declare class NienHoc {
    nien_hoc_id: number;
    ten_nien_hoc: string;
    ngay_bat_dau: string;
    ngay_ket_thuc: string;
    trang_thai: boolean;
    lop: Lop[];
    hoc_ky: HocKy[];
}
