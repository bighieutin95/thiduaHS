import { To } from './to.entity';
import { Lop } from './lop.entity';
import { LichSuChamDiem } from './lichsu-chamdiem.entity';
import { TongHopTuan } from './tonghop-tuan.entity';
import { TongHopThang } from './tonghop-thang.entity';
export declare class HocSinh {
    hoc_sinh_id: number;
    lop_id: number;
    to_id: number;
    ho_ten: string;
    email: string;
    ma_hoc_sinh: string;
    vai_tro_thi_dua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho' | 'HocSinh';
    lop: Lop;
    to: To;
    lich_su_cham: LichSuChamDiem[];
    tong_hop_tuan: TongHopTuan[];
    tong_hop_thang: TongHopThang[];
}
