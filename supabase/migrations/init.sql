-- =========================================================================
-- SCRIPT KHỞI TẠO CƠ SỞ DỮ LIỆU THIDUAHS (POSTGRESQL ON SUPABASE)
-- =========================================================================

-- Kích hoạt extension sinh UUID nếu chưa có
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG: td_nguoidung
-- Lưu trữ thông tin tài khoản được đồng bộ từ auth.users của Supabase
CREATE TABLE IF NOT EXISTS public.td_nguoidung (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    ho_ten VARCHAR(255),
    avatar_url TEXT,
    vai_tro_he_thong VARCHAR(50) DEFAULT 'User' CHECK (vai_tro_he_thong IN ('Admin', 'User')),
    ngay_tao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tự động đồng bộ từ auth.users của Supabase sang td_nguoidung khi đăng nhập/đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.td_nguoidung (user_id, email, ho_ten, avatar_url, vai_tro_he_thong)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    'User'
  )
  ON CONFLICT (user_id) DO UPDATE
  SET email = EXCLUDED.email,
      ho_ten = EXCLUDED.ho_ten,
      avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger đồng bộ tài khoản
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. BẢNG: td_nienhoc (Năm học)
CREATE TABLE IF NOT EXISTS public.td_nienhoc (
    nien_hoc_id SERIAL PRIMARY KEY,
    ten_nien_hoc VARCHAR(50) UNIQUE NOT NULL, -- Ví dụ: "2026-2027"
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    trang_thai BOOLEAN DEFAULT true
);

-- 3. BẢNG: td_hocky (Học kỳ)
CREATE TABLE IF NOT EXISTS public.td_hocky (
    hoc_ky_id SERIAL PRIMARY KEY,
    nien_hoc_id INT REFERENCES public.td_nienhoc(nien_hoc_id) ON DELETE CASCADE NOT NULL,
    ten_hoc_ky VARCHAR(50) NOT NULL, -- Ví dụ: "Học kỳ 1", "Học kỳ 2"
    trang_thai BOOLEAN DEFAULT true
);

-- 4. BẢNG: td_lop (Lớp học)
CREATE TABLE IF NOT EXISTS public.td_lop (
    lop_id SERIAL PRIMARY KEY,
    nien_hoc_id INT REFERENCES public.td_nienhoc(nien_hoc_id) ON DELETE RESTRICT NOT NULL,
    ten_lop VARCHAR(50) NOT NULL, -- Ví dụ: "10A1"
    khoi INT NOT NULL, -- Ví dụ: 10, 11, 12
    gvcn_email VARCHAR(255)
);

-- 5. BẢNG: td_to (Tổ học tập)
CREATE TABLE IF NOT EXISTS public.td_to (
    to_id SERIAL PRIMARY KEY,
    lop_id INT REFERENCES public.td_lop(lop_id) ON DELETE CASCADE NOT NULL,
    ten_to VARCHAR(50) NOT NULL -- Ví dụ: "Tổ 1", "Tổ 2"
);

-- 6. BẢNG: td_hocsinh (Học sinh)
-- Liên kết vai trò thi đua của từng cá nhân học sinh
CREATE TABLE IF NOT EXISTS public.td_hocsinh (
    hoc_sinh_id SERIAL PRIMARY KEY,
    lop_id INT REFERENCES public.td_lop(lop_id) ON DELETE RESTRICT NOT NULL,
    to_id INT REFERENCES public.td_to(to_id) ON DELETE SET NULL,
    ho_ten VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    ma_hoc_sinh VARCHAR(50) UNIQUE,
    vai_tro_thi_dua VARCHAR(50) DEFAULT 'HocSinh' 
        CHECK (vai_tro_thi_dua IN ('LopTruong', 'LopPho', 'ToTruong', 'ToPho', 'HocSinh'))
);

-- 7. BẢNG: td_danhmuc_tieuchi (Tiêu chí chấm thi đua)
CREATE TABLE IF NOT EXISTS public.td_danhmuc_tieuchi (
    tieu_chi_id SERIAL PRIMARY KEY,
    ten_tieu_chi VARCHAR(255) NOT NULL,
    nhom_tieu_chi VARCHAR(100) NOT NULL, -- Ví dụ: "Chuyên cần", "Học tập", "Nền nếp"
    loai VARCHAR(10) CHECK (loai IN ('Cong', 'Tru')) NOT NULL, -- Cong: cộng điểm, Tru: trừ điểm
    so_diem DECIMAL(5,2) NOT NULL,
    trang_thai BOOLEAN DEFAULT true
);

-- 8. BẢNG: td_lichsu_chamdiem (Lịch sử chấm điểm thi đua)
CREATE TABLE IF NOT EXISTS public.td_lichsu_chamdiem (
    lich_su_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoi_cham_id UUID REFERENCES public.td_nguoidung(user_id) ON DELETE RESTRICT NOT NULL,
    hoc_sinh_id INT REFERENCES public.td_hocsinh(hoc_sinh_id) ON DELETE CASCADE NOT NULL,
    tieu_chi_id INT REFERENCES public.td_danhmuc_tieuchi(tieu_chi_id) ON DELETE RESTRICT NOT NULL,
    so_diem_thuc_te DECIMAL(5,2) NOT NULL,
    ngay_vi_pham DATE DEFAULT CURRENT_DATE NOT NULL,
    ngay_cham TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    mo_ta TEXT,
    hinh_anh_minh_chung TEXT,
    tuan_thu INT NOT NULL,
    trang_thai VARCHAR(20) DEFAULT 'HieuLuc' CHECK (trang_thai IN ('HieuLuc', 'BiHuy'))
);

-- 9. BẢNG: td_tonghop_tuan (Tổng hợp điểm cá nhân tuần)
CREATE TABLE IF NOT EXISTS public.td_tonghop_tuan (
    tong_hop_tuan_id SERIAL PRIMARY KEY,
    hoc_sinh_id INT REFERENCES public.td_hocsinh(hoc_sinh_id) ON DELETE CASCADE NOT NULL,
    hoc_ky_id INT REFERENCES public.td_hocky(hoc_ky_id) ON DELETE RESTRICT NOT NULL,
    tuan_thu INT NOT NULL,
    diem_mac_dinh DECIMAL(5,2) DEFAULT 100.00 NOT NULL,
    tong_diem_cong DECIMAL(5,2) DEFAULT 0.00 NOT NULL,
    tong_diem_tru DECIMAL(5,2) DEFAULT 0.00 NOT NULL,
    diem_cuoi_cung DECIMAL(5,2) NOT NULL,
    ngay_chot TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_hocsinh_tuan UNIQUE (hoc_sinh_id, hoc_ky_id, tuan_thu)
);

-- 10. BẢNG: td_tonghop_thang (Tổng hợp điểm cá nhân tháng & Xếp loại)
CREATE TABLE IF NOT EXISTS public.td_tonghop_thang (
    tong_hop_thang_id SERIAL PRIMARY KEY,
    hoc_sinh_id INT REFERENCES public.td_hocsinh(hoc_sinh_id) ON DELETE CASCADE NOT NULL,
    thang INT NOT NULL CHECK (thang BETWEEN 1 AND 12),
    nam INT NOT NULL,
    diem_trung_binh DECIMAL(5,2) NOT NULL,
    xep_loai VARCHAR(50) NOT NULL,
    ngay_tong_hop TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_hocsinh_thang UNIQUE (hoc_sinh_id, thang, nam)
);

-- 11. BẢNG: td_phanquyen (Cấu hình quyền ban cán sự lớp)
CREATE TABLE IF NOT EXISTS public.td_phanquyen (
    phan_quyen_id SERIAL PRIMARY KEY,
    lop_id INT REFERENCES public.td_lop(lop_id) ON DELETE CASCADE NOT NULL,
    vai_tro_thi_dua VARCHAR(50) CHECK (vai_tro_thi_dua IN ('LopTruong', 'LopPho', 'ToTruong', 'ToPho')) NOT NULL,
    duoc_cham_to_vien BOOLEAN DEFAULT true,
    duoc_cham_to_truong BOOLEAN DEFAULT true,
    duoc_cham_ngoai_to BOOLEAN DEFAULT false,
    duoc_duyet_huy_diem BOOLEAN DEFAULT false,
    CONSTRAINT unique_lop_vaitro UNIQUE (lop_id, vai_tro_thi_dua)
);

-- Insert một số tiêu chí mặc định ban đầu
INSERT INTO public.td_danhmuc_tieuchi (ten_tieu_chi, nhom_tieu_chi, loai, so_diem) VALUES
('Đi học muộn', 'Chuyên cần', 'Tru', 2.00),
('Nghỉ học không phép', 'Chuyên cần', 'Tru', 5.00),
('Nghỉ học có phép', 'Chuyên cần', 'Tru', 0.00),
('Không mang bảng tên / khăn quàng', 'Nền nếp', 'Tru', 2.00),
('Không mặc đồng phục đúng quy định', 'Nền nếp', 'Tru', 3.00),
('Sử dụng điện thoại trong giờ học không phép', 'Học tập', 'Tru', 5.00),
('Mất trật tự trong lớp', 'Học tập', 'Tru', 2.00),
('Không chuẩn bị bài / không thuộc bài', 'Học tập', 'Tru', 3.00),
('Phát biểu xây dựng bài học', 'Học tập', 'Cong', 2.00),
('Đạt điểm 9 hoặc 10 trong bài kiểm tra', 'Học tập', 'Cong', 5.00),
('Tích cực tham gia vệ sinh, trực nhật', 'Trực nhật', 'Cong', 3.00),
('Tham gia tích cực phong trào đoàn trường', 'Phong trào', 'Cong', 5.00),
('Có hành động đẹp, nhặt được của rơi trả lại', 'Đạo đức', 'Cong', 10.00)
ON CONFLICT DO NOTHING;
