# Tài liệu API Backend (NestJS): ThiDuaHS

Tài liệu này đặc tả các API Endpoint của Backend NestJS, định nghĩa các phương thức HTTP, cấu trúc Request/Response, và cơ chế bảo mật xác thực Token.

---

## 1. Cơ chế Xác thực & Phân quyền API
- Tất cả API (ngoại trừ các API public) đều yêu cầu đính kèm mã JWT Token trong Header:
  `Authorization: Bearer <Supabase_JWT_Token>`
- Backend sử dụng NestJS **AuthGuard** để verify token qua Supabase Auth. Sau khi xác thực, thông tin user được lưu trong `request.user`.
- API kiểm soát quyền bằng NestJS **RolesGuard** kết hợp kiểm tra dữ liệu từ hai bảng `td_nguoidung` và `td_hocsinh` để quyết định xem người dùng có quyền gọi endpoint đó hay không.

---

## 2. Danh sách các API Endpoints

### 2.1 Module Xác thực (Auth)

#### `GET /api/auth/profile`
Lấy thông tin tài khoản hiện tại, vai trò hệ thống và vai trò thi đua trong lớp học.
- **Yêu cầu token**: Có.
- **Response (200 OK)**:
  ```json
  {
    "user_id": "8a7c5b9d-4e24-8c37-ccad-4727811edb86",
    "email": "loptruong10a1@school.edu.vn",
    "ho_ten": "Nguyễn Văn A",
    "avatar_url": "https://lh3.googleusercontent.com/a/...",
    "vai_tro_he_thong": "User",
    "hoc_sinh": {
      "hoc_sinh_id": 12,
      "lop_id": 3,
      "ten_lop": "10A1",
      "to_id": 1,
      "ten_to": "Tổ 1",
      "vai_tro_thi_dua": "LopTruong"
    }
  }
  ```

---

### 2.2 Module Quản lý Lớp & Học sinh (Admin only)

#### `GET /api/classes`
Lấy danh sách các lớp học của năm học hiện tại.
- **Yêu cầu token**: Có.
- **Quyền**: Admin.

#### `POST /api/classes`
Tạo một lớp học mới.
- **Request Body**:
  ```json
  {
    "ten_lop": "10A1",
    "khoi": 10,
    "nien_hoc_id": 1,
    "gvcn_email": "gvcn10a1@school.edu.vn"
  }
  ```

#### `GET /api/classes/:classId/students`
Lấy danh sách học sinh thuộc một lớp học cụ thể.
- **Quyền**: Admin, Ban cán sự của lớp đó.

#### `POST /api/students/import`
Import danh sách học sinh của một lớp từ file Excel hoặc mảng JSON.
- **Request Body**:
  ```json
  {
    "lop_id": 3,
    "hoc_sinh_list": [
      { "ho_ten": "Trần Thị B", "email": "tranthib@school.edu.vn", "ma_hoc_sinh": "HS10A101", "ten_to": "Tổ 1" },
      { "ho_ten": "Lê Văn C", "email": "levanc@school.edu.vn", "ma_hoc_sinh": "HS10A102", "ten_to": "Tổ 1" }
    ]
  }
  ```

---

### 2.3 Module Tiêu chí Thi đua (Emulation Criteria)

#### `GET /api/criteria`
Lấy danh sách các tiêu chí thi đua (cộng/trừ điểm).
- **Quyền**: Mọi vai trò đã đăng nhập.

#### `POST /api/criteria`
Tạo mới một tiêu chí thi đua.
- **Quyền**: Admin.
- **Request Body**:
  ```json
  {
    "ten_tieu_chi": "Đi học muộn",
    "nhom_tieu_chi": "Chuyên cần",
    "loai": "Tru",
    "so_diem": 2.00
  }
  ```

---

### 2.4 Module Chấm điểm & Lịch sử (Grading & History)

#### `POST /api/emulation/grade`
Ghi nhận một đầu điểm thi đua (cộng hoặc trừ) cho một học sinh.
- **Quyền**: Ban cán sự lớp (Lớp trưởng, Lớp phó, Tổ trưởng, Tổ phó) theo phân quyền của lớp.
- **Request Body**:
  ```json
  {
    "hoc_sinh_id": 15,
    "tieu_chi_id": 4,
    "ngay_vi_pham": "2026-08-12",
    "mo_ta": "Không mang bảng tên trong giờ chào cờ",
    "hinh_anh_minh_chung": "https://supabase-storage.url/emulation/evidence_123.jpg"
  }
  ```
- **Xử lý logic ở Backend**:
  - Xác định tuần học dựa trên `ngay_vi_pham`.
  - Kiểm tra xem tuần đó đã bị chốt chưa (thời gian hiện tại có vượt quá 22h00 thứ Sáu của tuần đó không). Nếu đã chốt -> trả về `400 Bad Request`.
  - Kiểm tra quyền chấm điểm của người dùng đăng nhập đối với học sinh mục tiêu (`hoc_sinh_id`) dựa vào lớp học và cấu hình bảng `td_phanquyen`.

#### `GET /api/emulation/history`
Lấy lịch sử chấm điểm thi đua. Hỗ trợ lọc theo `lop_id`, `hoc_sinh_id`, `tuan_thu`, và `trang_thai`.
- **Quyền**: Ban cán sự lớp xem toàn lớp, học sinh chỉ xem lịch sử chấm điểm của bản thân mình.

#### `PUT /api/emulation/history/:lichSuId/cancel`
Hủy một bản ghi chấm điểm bị sai (chuyển trạng thái sang `'BiHuy'`).
- **Quyền**: Admin, hoặc Lớp trưởng của lớp đó (nếu được cấu hình quyền `duoc_duyet_huy_diem = true` trong `td_phanquyen`).
- **Xử lý logic ở Backend**:
  - Không cho phép hủy nếu tuần chứa bản ghi đó đã bị chốt (sau 22h00 thứ Sáu của tuần học đó).

---

### 2.5 Module Phân quyền Thi đua (Permissions)

#### `GET /api/permissions/:classId`
Lấy danh sách cấu hình phân quyền chấm điểm thi đua của từng lớp.
- **Quyền**: Admin, Ban cán sự lớp.

#### `PUT /api/permissions/:classId`
Cập nhật cấu hình phân quyền chấm điểm thi đua trong một lớp học.
- **Quyền**: Admin.
- **Request Body**:
  ```json
  [
    {
      "vai_tro_thi_dua": "ToTruong",
      "duoc_cham_to_vien": true,
      "duoc_cham_to_truong": false,
      "duoc_cham_ngoai_to": false,
      "duoc_duyet_huy_diem": false
    },
    {
      "vai_tro_thi_dua": "LopTruong",
      "duoc_cham_to_vien": true,
      "duoc_cham_to_truong": true,
      "duoc_cham_ngoai_to": true,
      "duoc_duyet_huy_diem": true
    }
  ]
  ```

---

### 2.6 Module Báo cáo & Tổng hợp (Reports & Summaries)

#### `GET /api/emulation/reports/weekly`
Lấy bảng điểm tổng hợp tuần của lớp hoặc của cá nhân học sinh.
- **Query Params**: `lop_id` (required), `tuan_thu` (required).
- **Response (200 OK)**: Danh sách học sinh trong lớp kèm điểm mặc định, tổng điểm cộng, tổng điểm trừ và điểm cuối tuần.

#### `GET /api/emulation/reports/monthly`
Lấy bảng điểm tổng hợp tháng và xếp loại thi đua cá nhân.
- **Query Params**: `lop_id` (required), `thang` (required), `nam` (required).
- **Response (200 OK)**:
  ```json
  [
    {
      "hoc_sub_id": 12,
      "ho_ten": "Nguyễn Văn A",
      "diem_trung_binh": 96.50,
      "xep_loai": "Xuất sắc"
    },
    {
      "hoc_sub_id": 15,
      "ho_ten": "Trần Thị B",
      "diem_trung_binh": 88.20,
      "xep_loai": "Tốt"
    }
  ]
  ```
