import { Repository } from 'typeorm';
import { HocSinh } from '../../entities/hocsinh.entity';
export declare class HocSinhService {
    private hocSinhRepo;
    constructor(hocSinhRepo: Repository<HocSinh>);
    findByLop(lopId: number): Promise<HocSinh[]>;
    create(data: Partial<HocSinh>): Promise<HocSinh>;
    update(id: number, data: Partial<HocSinh>): Promise<HocSinh>;
    remove(id: number): Promise<{
        message: string;
    }>;
    importList(lopId: number, list: Partial<HocSinh>[]): Promise<HocSinh[]>;
    updateVaiTro(hocSinhId: number, vaiTro: HocSinh['vai_tro_thi_dua']): Promise<{
        message: string;
    }>;
}
