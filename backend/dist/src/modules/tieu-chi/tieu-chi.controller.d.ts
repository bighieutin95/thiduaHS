import { TieuChiService } from './tieu-chi.service';
export declare class TieuChiController {
    private readonly tieuChiService;
    constructor(tieuChiService: TieuChiService);
    findAll(): Promise<import("../../entities/danhmuc-tieuchi.entity").DanhMucTieuChi[]>;
    create(body: any): Promise<import("../../entities/danhmuc-tieuchi.entity").DanhMucTieuChi>;
}
