import { Repository } from 'typeorm';
import { DanhMucTieuChi } from '../../entities/danhmuc-tieuchi.entity';
export declare class TieuChiService {
    private tieuChiRepo;
    constructor(tieuChiRepo: Repository<DanhMucTieuChi>);
    findAll(): Promise<DanhMucTieuChi[]>;
    create(data: Partial<DanhMucTieuChi>): Promise<DanhMucTieuChi>;
}
