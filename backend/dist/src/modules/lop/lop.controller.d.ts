import { LopService } from './lop.service';
export declare class LopController {
    private readonly lopService;
    constructor(lopService: LopService);
    findAll(): Promise<import("../../entities/lop.entity").Lop[]>;
    findStudents(classId: number): Promise<import("../../entities/hocsinh.entity").HocSinh[]>;
    create(body: any): Promise<import("../../entities/lop.entity").Lop>;
    update(id: number, body: any): Promise<import("../../entities/lop.entity").Lop>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
