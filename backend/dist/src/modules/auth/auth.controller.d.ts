import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    mockLogin(email: string): Promise<{
        access_token: string;
    }>;
    getProfile(user: any): Promise<{
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
}
