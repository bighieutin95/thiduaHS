import { Repository } from 'typeorm';
import { NguoiDung } from '../../entities/nguoidung.entity';
import { HocSinh } from '../../entities/hocsinh.entity';
import { Lop } from '../../entities/lop.entity';
export declare class AuthService {
    private readonly nguoiDungRepo;
    private readonly hocSinhRepo;
    private readonly lopRepo;
    constructor(nguoiDungRepo: Repository<NguoiDung>, hocSinhRepo: Repository<HocSinh>, lopRepo: Repository<Lop>);
    getProfile(userId: string, email: string): Promise<{
        user_id: string;
        email: string;
        ho_ten: string;
        avatar_url: string;
        vai_tro_he_thong: "User" | "Admin";
        hoc_sinh: {
            hoc_sinh_id: number;
            lop_id: number;
            to_id: number;
            ho_ten: string;
            ma_hoc_sinh: string;
            vai_tro_thi_dua: "LopTruong" | "LopPho" | "ToTruong" | "ToPho" | "HocSinh";
            ten_to: string | null;
            ten_lop: string | null;
        } | null;
        gvcn_lop: {
            lop_id: number;
            ten_lop: string;
        } | null;
    }>;
    private getFallbackProfile;
    setVaiTroHeThong(userId: string, vaiTro: 'Admin' | 'User'): Promise<{
        message: string;
    }>;
    mockLogin(email: string): Promise<{
        access_token: string;
    }>;
}
