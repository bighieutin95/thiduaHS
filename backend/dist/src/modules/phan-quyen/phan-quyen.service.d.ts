import { Repository } from 'typeorm';
import { PhanQuyen } from '../../entities/phanquyen.entity';
export declare class PhanQuyenService {
    private phanQuyenRepo;
    constructor(phanQuyenRepo: Repository<PhanQuyen>);
    findByLop(lopId: number): Promise<PhanQuyen[]>;
    updateByLop(lopId: number, configs: Partial<PhanQuyen>[]): Promise<{
        message: string;
    }>;
}
