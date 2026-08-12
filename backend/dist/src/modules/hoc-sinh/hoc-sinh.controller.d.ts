import { HocSinhService } from './hoc-sinh.service';
export declare class HocSinhController {
    private readonly hocSinhService;
    constructor(hocSinhService: HocSinhService);
    findByLop(lopId: number): Promise<import("../../entities/hocsinh.entity").HocSinh[]>;
    create(body: any): Promise<import("../../entities/hocsinh.entity").HocSinh>;
    update(id: number, body: any): Promise<import("../../entities/hocsinh.entity").HocSinh>;
    remove(id: number): Promise<{
        message: string;
    }>;
    importList(body: {
        lop_id: number;
        hoc_sinh_list: any[];
    }): Promise<import("../../entities/hocsinh.entity").HocSinh[]>;
    updateRole(id: number, vaiTro: any): Promise<{
        message: string;
    }>;
}
