import { Repository } from 'typeorm';
import { Lop } from '../../entities/lop.entity';
import { To } from '../../entities/to.entity';
import { HocSinh } from '../../entities/hocsinh.entity';
export declare class LopService {
    private lopRepo;
    private toRepo;
    private hocSinhRepo;
    constructor(lopRepo: Repository<Lop>, toRepo: Repository<To>, hocSinhRepo: Repository<HocSinh>);
    findAll(): Promise<Lop[]>;
    findStudentsByClass(lopId: number): Promise<HocSinh[]>;
    create(data: Partial<Lop>): Promise<Lop>;
    update(id: number, data: Partial<Lop>): Promise<Lop>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
