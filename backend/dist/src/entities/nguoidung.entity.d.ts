import { LichSuChamDiem } from './lichsu-chamdiem.entity';
export declare class NguoiDung {
    user_id: string;
    email: string;
    ho_ten: string;
    avatar_url: string;
    vai_tro_he_thong: 'Admin' | 'User';
    mat_khau: string;
    ngay_tao: Date;
    lich_su_cham: LichSuChamDiem[];
}
