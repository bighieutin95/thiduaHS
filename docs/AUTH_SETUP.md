# Hướng dẫn Thiết lập Xác thực: Supabase Auth & Google OAuth

Tài liệu này hướng dẫn chi tiết các bước cấu hình đăng nhập Google OAuth thông qua Supabase Authentication cho ứng dụng **ThiDuaHS**.

---

## 1. Cấu hình trên Google Cloud Console

Để người dùng có thể đăng nhập bằng tài khoản Google, bạn cần tạo thông tin xác thực OAuth 2.0 trên Google Cloud Console:

1. **Truy cập Console**: Truy cập vào [Google Cloud Console](https://console.cloud.google.com/).
2. **Tạo Dự án mới** (nếu chưa có):
   - Nhấn vào menu dự án ở trên cùng bên trái -> Chọn **New Project**.
   - Nhập tên dự án (ví dụ: `ThiDuaHS`) -> Nhấn **Create**.
3. **Cấu hình OAuth Consent Screen (Màn hình đồng ý)**:
   - Đi tới mục **APIs & Services** -> **OAuth consent screen**.
   - Chọn **User Type** là **External** (nếu dùng cho mọi tài khoản Google cá nhân) hoặc **Internal** (nếu dùng giới hạn trong Workspace của trường học/tổ chức) -> Nhấn **Create**.
   - Điền các thông tin bắt buộc: App name (`ThiDuaHS`), User support email, Developer contact information.
   - Ở bước **Scopes**: Nhấn **Add or Remove Scopes**, chọn `.../auth/userinfo.email`, `.../auth/userinfo.profile` và `openid` -> Nhấn **Save and Continue**.
   - Ở bước **Test Users**: Thêm các email bạn dùng để kiểm thử (nếu ứng dụng đang ở chế độ Testing/chưa Publish).
4. **Tạo OAuth Client ID**:
   - Đi tới mục **APIs & Services** -> **Credentials**.
   - Nhấn **Create Credentials** -> Chọn **OAuth client ID**.
   - Chọn **Application type** là **Web application**.
   - Nhập tên (ví dụ: `ThiDuaHS Web App`).
   - Mục **Authorized redirect URIs**: Đây là URI mà Google sẽ trả kết quả xác thực về cho Supabase.
     - Lấy URL này từ Supabase Dashboard (Xem phần 2 bên dưới). Nó có dạng:
       `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Nhấn **Create**.
   - **Lưu lại**: **Client ID** và **Client Secret** để điền vào Supabase.

---

## 2. Cấu hình trên Supabase Dashboard

1. **Truy cập Supabase**: Vào [Supabase Dashboard](https://supabase.com/) -> Chọn Project của bạn.
2. **Kích hoạt Google Provider**:
   - Đi tới mục **Authentication** -> **Providers** -> Chọn **Google**.
   - Bật trạng thái thành **Enabled** (ON).
   - Điền **Client ID** và **Client Secret** lấy từ bước tạo Credentials trên Google Cloud Console ở trên.
   - Nhấn **Save**.
3. **Lấy Redirect URI**:
   - Ngay dưới ô cấu hình Google Provider trên Supabase, bạn sẽ thấy mục **Redirect URL** (ví dụ: `https://xxxxxx.supabase.co/auth/v1/callback`).
   - Sao chép URL này và dán ngược lại vào mục **Authorized redirect URIs** trên Google Cloud Console (Bước 1.4 ở trên).
4. **Cấu hình Site URL & Redirect URLs**:
   - Đi tới mục **Authentication** -> **URL Configuration**.
   - **Site URL**: Nhập URL gốc của ứng dụng (ví dụ ở local: `http://localhost:5173`, hoặc URL production trên Vercel: `https://thiduahs.vercel.app`).
   - **Redirect URLs**: Thêm các URL được phép chuyển hướng sau khi đăng nhập (ví dụ: `http://localhost:5173/*`, `https://thiduahs.vercel.app/*`).

---

## 3. Cấu hình biến môi trường (Environment Variables)

Sau khi thiết lập xong, bạn cần tạo các file chứa biến môi trường ở Frontend và Backend để dự án có thể kết nối với Supabase.

### 3.1 Cấu hình Frontend (`frontend/.env`)
Tạo file `.env` trong thư mục `frontend/` với nội dung:
```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_BACKEND_URL=http://localhost:3000/api
```

### 3.2 Cấu hình Backend (`backend/.env`)
Tạo file `.env` trong thư mục `backend/` với nội dung:
```env
PORT=3000
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:<password>@db.<your-project-ref>.supabase.co:5432/postgres
```
*(Gợi ý: Lấy DATABASE_URL từ mục Project Settings -> Database trên Supabase)*
