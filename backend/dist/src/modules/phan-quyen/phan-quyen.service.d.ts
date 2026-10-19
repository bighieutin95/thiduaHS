import { Repository } from 'typeorm';
import { PhanQuyen } from '../../entities/phanquyen.entity';
import { NguoiDung } from '../../entities/nguoidung.entity';
export declare class PhanQuyenService {
    private readonly phanQuyenRepo;
    private readonly nguoiDungRepo;
    constructor(phanQuyenRepo: Repository<PhanQuyen>, nguoiDungRepo: Repository<NguoiDung>);
    findByLop(lopId: number): Promise<PhanQuyen[]>;
    updateByLop(lopId: number, configs: Partial<PhanQuyen>[]): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<NguoiDung[]>;
    updateUser(body: {
        email: string;
        username?: string;
        mat_khau?: string;
        vai_tro_he_thong?: string;
        ho_ten?: string;
    }): Promise<{
        message: string;
        user: NguoiDung;
    }>;
    updatePassword(email: string, matKhau: string): Promise<{
        message: string;
    }>;
}
