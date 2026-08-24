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
    updatePassword(email: string, matKhau: string): Promise<{
        message: string;
    }>;
}
