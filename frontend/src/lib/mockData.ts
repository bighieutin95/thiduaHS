// frontend/src/lib/mockData.ts
// Nguồn dữ liệu trung tâm dùng chung, tự động đồng bộ localStorage và API backend

export interface MockClass {
  lop_id: number;
  ten_lop: string;
  khoi: number;
  gvcn_email: string;
  gvcn_hoten: string;
  si_so: number;
  to?: { to_id: number; ten_to: string }[];
}

export interface MockStudent {
  hoc_sinh_id: number;
  lop_id: number;
  to_id: number;
  ho_ten: string;
  ma_hoc_sinh: string;
  vai_tro_thi_dua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho' | 'HocSinh';
  email: string;
  to?: { ten_to: string };
  lop?: { ten_lop: string };
}

export interface MockCriterion {
  tieu_chi_id: number;
  ten_tieu_chi: string;
  nhom_tieu_chi: string;
  loai: 'Cong' | 'Tru';
  so_diem: string;
  trang_thai: boolean;
}

export interface MockGradeRecord {
  lich_su_id: string;
  nguoi_cham: { ho_ten: string };
  hoc_sinh: { ho_ten: string };
  tieu_chi: { ten_tieu_chi: string; loai: 'Cong' | 'Tru' };
  so_diem_thuc_te: string;
  ngay_vi_pham: string;
  mo_ta: string;
  tuan_thu: number;
}

// 1. Dữ liệu Lớp học mặc định
export const DEFAULT_CLASSES: MockClass[] = [
  {
    lop_id: 4,
    ten_lop: '11C2',
    khoi: 11,
    gvcn_email: 'gvcn11c2@thiduahs.com',
    gvcn_hoten: 'Thầy/Cô GVCN (11C2)',
    si_so: 35,
    to: [
      { to_id: 1, ten_to: 'Tổ 1' },
      { to_id: 2, ten_to: 'Tổ 2' },
      { to_id: 3, ten_to: 'Tổ 3' },
      { to_id: 4, ten_to: 'Tổ 4' },
    ],
  },
  {
    lop_id: 1,
    ten_lop: '10A1',
    khoi: 10,
    gvcn_email: 'gvcn10a1@thiduahs.com',
    gvcn_hoten: 'Thầy Nguyễn Văn A',
    si_so: 38,
    to: [
      { to_id: 1, ten_to: 'Tổ 1' },
      { to_id: 2, ten_to: 'Tổ 2' },
      { to_id: 3, ten_to: 'Tổ 3' },
      { to_id: 4, ten_to: 'Tổ 4' },
    ],
  },
  {
    lop_id: 2,
    ten_lop: '10A2',
    khoi: 10,
    gvcn_email: 'gvcn10a2@thiduahs.com',
    gvcn_hoten: 'Cô Trần Thị B',
    si_so: 36,
    to: [
      { to_id: 1, ten_to: 'Tổ 1' },
      { to_id: 2, ten_to: 'Tổ 2' },
      { to_id: 3, ten_to: 'Tổ 3' },
      { to_id: 4, ten_to: 'Tổ 4' },
    ],
  },
  {
    lop_id: 3,
    ten_lop: '11B1',
    khoi: 11,
    gvcn_email: 'gvcn11b1@thiduahs.com',
    gvcn_hoten: 'Thầy Lê Văn C',
    si_so: 34,
    to: [
      { to_id: 1, ten_to: 'Tổ 1' },
      { to_id: 2, ten_to: 'Tổ 2' },
      { to_id: 3, ten_to: 'Tổ 3' },
      { to_id: 4, ten_to: 'Tổ 4' },
    ],
  },
  {
    lop_id: 5,
    ten_lop: '12A1',
    khoi: 12,
    gvcn_email: 'gvcn12a1@thiduahs.com',
    gvcn_hoten: 'Cô Phạm Thị D',
    si_so: 40,
    to: [
      { to_id: 1, ten_to: 'Tổ 1' },
      { to_id: 2, ten_to: 'Tổ 2' },
      { to_id: 3, ten_to: 'Tổ 3' },
      { to_id: 4, ten_to: 'Tổ 4' },
    ],
  },
];

// 2. Dữ liệu Học sinh Lớp 11C2 (Ban cán sự & tổ viên)
export const DEFAULT_STUDENTS_11C2: MockStudent[] = [
  {
    hoc_sinh_id: 1,
    lop_id: 4,
    to_id: 1,
    ho_ten: 'Liêng Jrang Thu An',
    ma_hoc_sinh: 'hs2102106193',
    vai_tro_thi_dua: 'LopTruong',
    email: 'hs2102106193@thiduahs.com',
    to: { ten_to: 'Tổ 1' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 2,
    lop_id: 4,
    to_id: 1,
    ho_ten: 'Nguyễn Văn An',
    ma_hoc_sinh: 'hs2102106194',
    vai_tro_thi_dua: 'LopPho',
    email: 'loppho11c2@thiduahs.com',
    to: { ten_to: 'Tổ 1' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 3,
    lop_id: 4,
    to_id: 1,
    ho_ten: 'Tou Prong Khúy',
    ma_hoc_sinh: 'hs2001272118',
    vai_tro_thi_dua: 'ToTruong',
    email: 'hs2001272118@thiduahs.com',
    to: { ten_to: 'Tổ 1' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 4,
    lop_id: 4,
    to_id: 1,
    ho_ten: 'Lê Thị Mai',
    ma_hoc_sinh: 'hs2001272119',
    vai_tro_thi_dua: 'ToPho',
    email: 'topho1@thiduahs.com',
    to: { ten_to: 'Tổ 1' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 5,
    lop_id: 4,
    to_id: 1,
    ho_ten: 'Ka Tuyn',
    ma_hoc_sinh: 'hs2001272017',
    vai_tro_thi_dua: 'HocSinh',
    email: 'hs2001272017@thiduahs.com',
    to: { ten_to: 'Tổ 1' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 6,
    lop_id: 4,
    to_id: 2,
    ho_ten: 'Bàn Thị Thu Nhung',
    ma_hoc_sinh: 'hs2001251611',
    vai_tro_thi_dua: 'ToTruong',
    email: 'hs2001251611@thiduahs.com',
    to: { ten_to: 'Tổ 2' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 7,
    lop_id: 4,
    to_id: 2,
    ho_ten: "K' Brô",
    ma_hoc_sinh: 'hs2001272018',
    vai_tro_thi_dua: 'HocSinh',
    email: 'hs2001272018@thiduahs.com',
    to: { ten_to: 'Tổ 2' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 8,
    lop_id: 4,
    to_id: 2,
    ho_ten: 'Phạm Hồng Ánh',
    ma_hoc_sinh: 'hs2001272025',
    vai_tro_thi_dua: 'HocSinh',
    email: 'hs2001272025@thiduahs.com',
    to: { ten_to: 'Tổ 2' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 9,
    lop_id: 4,
    to_id: 3,
    ho_ten: 'Ka Ly Na',
    ma_hoc_sinh: 'hs2104298771',
    vai_tro_thi_dua: 'ToTruong',
    email: 'hs2104298771@thiduahs.com',
    to: { ten_to: 'Tổ 3' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 10,
    lop_id: 4,
    to_id: 3,
    ho_ten: 'Trần Minh Trí',
    ma_hoc_sinh: 'hs2001272019',
    vai_tro_thi_dua: 'HocSinh',
    email: 'hs2001272019@thiduahs.com',
    to: { ten_to: 'Tổ 3' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 11,
    lop_id: 4,
    to_id: 3,
    ho_ten: 'Đinh Hoàng Long',
    ma_hoc_sinh: 'hs2001272030',
    vai_tro_thi_dua: 'HocSinh',
    email: 'hs2001272030@thiduahs.com',
    to: { ten_to: 'Tổ 3' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 12,
    lop_id: 4,
    to_id: 4,
    ho_ten: "Ra Nàng K' Giâng",
    ma_hoc_sinh: 'hs2106115809',
    vai_tro_thi_dua: 'ToTruong',
    email: 'hs2106115809@thiduahs.com',
    to: { ten_to: 'Tổ 4' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 13,
    lop_id: 4,
    to_id: 4,
    ho_ten: 'Vũ Quốc Bảo',
    ma_hoc_sinh: 'hs2001272045',
    vai_tro_thi_dua: 'HocSinh',
    email: 'hs2001272045@thiduahs.com',
    to: { ten_to: 'Tổ 4' },
    lop: { ten_lop: '11C2' },
  },
  {
    hoc_sinh_id: 14,
    lop_id: 4,
    to_id: 4,
    ho_ten: 'Ngô Thị Thanh Thảo',
    ma_hoc_sinh: 'hs2001272050',
    vai_tro_thi_dua: 'HocSinh',
    email: 'hs2001272050@thiduahs.com',
    to: { ten_to: 'Tổ 4' },
    lop: { ten_lop: '11C2' },
  },
];

// 3. Tiêu chí thi đua mặc định
export const DEFAULT_CRITERIA: MockCriterion[] = [
  { tieu_chi_id: 1, ten_tieu_chi: 'Đi học muộn', nhom_tieu_chi: 'Chuyên cần', loai: 'Tru', so_diem: '2.00', trang_thai: true },
  { tieu_chi_id: 2, ten_tieu_chi: 'Nghỉ học không phép', nhom_tieu_chi: 'Chuyên cần', loai: 'Tru', so_diem: '5.00', trang_thai: true },
  { tieu_chi_id: 3, ten_tieu_chi: 'Nghỉ học có phép', nhom_tieu_chi: 'Chuyên cần', loai: 'Tru', so_diem: '0.00', trang_thai: true },
  { tieu_chi_id: 4, ten_tieu_chi: 'Không mặc đồng phục / không đeo bảng tên', nhom_tieu_chi: 'Nền nếp', loai: 'Tru', so_diem: '2.00', trang_thai: true },
  { tieu_chi_id: 5, ten_tieu_chi: 'Sử dụng điện thoại trong giờ học', nhom_tieu_chi: 'Học tập', loai: 'Tru', so_diem: '5.00', trang_thai: true },
  { tieu_chi_id: 6, ten_tieu_chi: 'Mất trật tự trong giờ học', nhom_tieu_chi: 'Học tập', loai: 'Tru', so_diem: '2.00', trang_thai: true },
  { tieu_chi_id: 7, ten_tieu_chi: 'Không làm bài tập về nhà', nhom_tieu_chi: 'Học tập', loai: 'Tru', so_diem: '3.00', trang_thai: true },
  { tieu_chi_id: 8, ten_tieu_chi: 'Phát biểu xây dựng bài học', nhom_tieu_chi: 'Học tập', loai: 'Cong', so_diem: '2.00', trang_thai: true },
  { tieu_chi_id: 9, ten_tieu_chi: 'Đạt điểm 9 hoặc 10 bài kiểm tra', nhom_tieu_chi: 'Học tập', loai: 'Cong', so_diem: '5.00', trang_thai: true },
  { tieu_chi_id: 10, ten_tieu_chi: 'Vệ sinh trực nhật sạch sẽ', nhom_tieu_chi: 'Trực nhật', loai: 'Cong', so_diem: '3.00', trang_thai: true },
  { tieu_chi_id: 11, ten_tieu_chi: 'Tích cực tham gia hoạt động phong trào Đoàn', nhom_tieu_chi: 'Phong trào', loai: 'Cong', so_diem: '5.00', trang_thai: true },
  { tieu_chi_id: 12, nhom_tieu_chi: 'Đạo đức', ten_tieu_chi: 'Nhặt được của rơi trả lại người mất', loai: 'Cong', so_diem: '10.00', trang_thai: true },
];

// 4. Lịch sử chấm điểm mẫu
export const DEFAULT_GRADE_RECORDS: MockGradeRecord[] = [
  {
    lich_su_id: 'rec-1',
    nguoi_cham: { ho_ten: 'Liêng Jrang Thu An (Lớp trưởng)' },
    hoc_sinh: { ho_ten: 'Ka Tuyn' },
    tieu_chi: { ten_tieu_chi: 'Phát biểu xây dựng bài học', loai: 'Cong' },
    so_diem_thuc_te: '2.00',
    ngay_vi_pham: '2026-10-19T08:30:00Z',
    mo_ta: 'Tích cực giải bài toán khó tiết 2',
    tuan_thu: 7,
  },
  {
    lich_su_id: 'rec-2',
    nguoi_cham: { ho_ten: 'Tou Prong Khúy (Tổ trưởng 1)' },
    hoc_sinh: { ho_ten: "K' Brô" },
    tieu_chi: { ten_tieu_chi: 'Không mặc đồng phục / không đeo bảng tên', loai: 'Tru' },
    so_diem_thuc_te: '2.00',
    ngay_vi_pham: '2026-10-20T07:15:00Z',
    mo_ta: 'Quên mang bảng tên',
    tuan_thu: 7,
  },
  {
    lich_su_id: 'rec-3',
    nguoi_cham: { ho_ten: 'Thầy/Cô GVCN (11C2)' },
    hoc_sinh: { ho_ten: 'Trần Minh Trí' },
    tieu_chi: { ten_tieu_chi: 'Đạt điểm 9 hoặc 10 bài kiểm tra', loai: 'Cong' },
    so_diem_thuc_te: '5.00',
    ngay_vi_pham: '2026-10-20T09:45:00Z',
    mo_ta: 'Điểm 10 kiểm tra 15 phút môn Hóa',
    tuan_thu: 7,
  },
  {
    lich_su_id: 'rec-4',
    nguoi_cham: { ho_ten: 'Bàn Thị Thu Nhung (Tổ trưởng 2)' },
    hoc_sinh: { ho_ten: 'Vũ Quốc Bảo' },
    tieu_chi: { ten_tieu_chi: 'Vệ sinh trực nhật sạch sẽ', loai: 'Cong' },
    so_diem_thuc_te: '3.00',
    ngay_vi_pham: '2026-10-19T11:30:00Z',
    mo_ta: 'Lau bảng và quét lớp xuất sắc',
    tuan_thu: 7,
  },
];

// Helper lưu & lấy dữ liệu từ localStorage
export function getStoredData<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Lỗi đọc ${key}:`, e);
  }
  return defaultVal;
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Lỗi ghi ${key}:`, e);
  }
}
