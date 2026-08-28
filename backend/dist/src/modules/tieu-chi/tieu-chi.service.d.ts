import { Repository } from 'typeorm';
import { DanhMucTieuChi } from '../../entities/danhmuc-tieuchi.entity';
export declare class TieuChiService {
    private tieuChiRepo;
    constructor(tieuChiRepo: Repository<DanhMucTieuChi>);
    findAll(showAll?: boolean): Promise<DanhMucTieuChi[]>;
    create(data: Partial<DanhMucTieuChi>): Promise<DanhMucTieuChi>;
    update(id: number, data: Partial<DanhMucTieuChi>): Promise<DanhMucTieuChi>;
    remove(id: number): Promise<DanhMucTieuChi>;
}
