import { TieuChiService } from './tieu-chi.service';
export declare class TieuChiController {
    private readonly tieuChiService;
    constructor(tieuChiService: TieuChiService);
    findAll(showAll?: string): Promise<import("../../entities/danhmuc-tieuchi.entity").DanhMucTieuChi[]>;
    create(body: any): Promise<import("../../entities/danhmuc-tieuchi.entity").DanhMucTieuChi>;
    update(id: number, body: any): Promise<import("../../entities/danhmuc-tieuchi.entity").DanhMucTieuChi>;
    remove(id: number): Promise<import("../../entities/danhmuc-tieuchi.entity").DanhMucTieuChi>;
}
