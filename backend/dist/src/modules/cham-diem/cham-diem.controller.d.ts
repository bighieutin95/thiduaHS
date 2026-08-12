import { ChamDiemService } from './cham-diem.service';
export declare class ChamDiemController {
    private readonly chamDiemService;
    constructor(chamDiemService: ChamDiemService);
    grade(user: any, body: any): Promise<import("../../entities/lichsu-chamdiem.entity").LichSuChamDiem>;
    history(query: any): Promise<import("../../entities/lichsu-chamdiem.entity").LichSuChamDiem[]>;
    cancel(id: string): Promise<{
        message: string;
    }>;
}
