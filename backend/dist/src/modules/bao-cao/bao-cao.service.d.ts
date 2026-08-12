import { Repository } from 'typeorm';
import { TongHopTuan } from '../../entities/tonghop-tuan.entity';
import { TongHopThang } from '../../entities/tonghop-thang.entity';
import { HocSinh } from '../../entities/hocsinh.entity';
import { LichSuChamDiem } from '../../entities/lichsu-chamdiem.entity';
export declare class BaoCaoService {
    private readonly tongHopTuanRepo;
    private readonly tongHopThangRepo;
    private readonly hocSinhRepo;
    private readonly lichSuRepo;
    constructor(tongHopTuanRepo: Repository<TongHopTuan>, tongHopThangRepo: Repository<TongHopThang>, hocSinhRepo: Repository<HocSinh>, lichSuRepo: Repository<LichSuChamDiem>);
    baoTuanTheoLop(lopId: number, tuanThu: number): Promise<TongHopTuan[]>;
    baoTuanRealtime(lopId: number, tuanThu: number): Promise<{
        hoc_sinh: HocSinh;
        tuan_thu: number;
        diem_mac_dinh: number;
        tong_diem_cong: number;
        tong_diem_tru: number;
        diem_cuoi_cung: number;
    }[]>;
    baoThangTheoLop(lopId: number, thang: number, nam: number): Promise<TongHopThang[]>;
}
