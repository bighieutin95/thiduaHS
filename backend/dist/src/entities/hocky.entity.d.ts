import { NienHoc } from './nienhoc.entity';
import { TongHopTuan } from './tonghop-tuan.entity';
export declare class HocKy {
    hoc_ky_id: number;
    nien_hoc_id: number;
    ten_hoc_ky: string;
    trang_thai: boolean;
    nien_hoc: NienHoc;
    tong_hop_tuan: TongHopTuan[];
}
