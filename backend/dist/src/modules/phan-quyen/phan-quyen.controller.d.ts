import { PhanQuyenService } from './phan-quyen.service';
export declare class PhanQuyenController {
    private readonly phanQuyenService;
    constructor(phanQuyenService: PhanQuyenService);
    findByLop(classId: number): Promise<import("../../entities/phanquyen.entity").PhanQuyen[]>;
    update(classId: number, body: any[]): Promise<{
        message: string;
    }>;
    updatePassword(email: string, matKhau: string): Promise<{
        message: string;
    }>;
}
