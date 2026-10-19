import { PhanQuyenService } from './phan-quyen.service';
export declare class PhanQuyenController {
    private readonly phanQuyenService;
    constructor(phanQuyenService: PhanQuyenService);
    findByLop(classId: number): Promise<import("../../entities/phanquyen.entity").PhanQuyen[]>;
    update(classId: number, body: any[]): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<import("../../entities/nguoidung.entity").NguoiDung[]>;
    updateUser(body: any): Promise<{
        message: string;
        user: import("../../entities/nguoidung.entity").NguoiDung;
    }>;
    updatePassword(email: string, matKhau: string): Promise<{
        message: string;
    }>;
}
