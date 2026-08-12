import { Lop } from './lop.entity';
import { HocSinh } from './hocsinh.entity';
export declare class To {
    to_id: number;
    lop_id: number;
    ten_to: string;
    lop: Lop;
    hoc_sinh: HocSinh[];
}
