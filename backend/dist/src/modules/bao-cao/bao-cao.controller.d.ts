import { BaoCaoService } from './bao-cao.service';
export declare class BaoCaoController {
    private readonly baoCaoService;
    constructor(baoCaoService: BaoCaoService);
    weekly(lopId: string, tuanThu: string): Promise<import("../../entities/tonghop-tuan.entity").TongHopTuan[]>;
    realtimeWeekly(lopId: string, tuanThu: string): Promise<{
        hoc_sinh: import("../../entities/hocsinh.entity").HocSinh;
        tuan_thu: number;
        diem_mac_dinh: number;
        tong_diem_cong: number;
        tong_diem_tru: number;
        diem_cuoi_cung: number;
    }[]>;
    monthly(lopId: string, thang: string, nam: string): Promise<import("../../entities/tonghop-thang.entity").TongHopThang[]>;
}
