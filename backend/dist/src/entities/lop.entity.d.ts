import { NienHoc } from './nienhoc.entity';
import { To } from './to.entity';
import { PhanQuyen } from './phanquyen.entity';
export declare class Lop {
    lop_id: number;
    nien_hoc_id: number;
    ten_lop: string;
    khoi: number;
    gvcn_email: string;
    nien_hoc: NienHoc;
    to: To[];
    phan_quyen: PhanQuyen[];
}
