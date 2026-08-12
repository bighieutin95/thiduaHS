# Hướng dẫn Triển khai ứng dụng ThiDuaHS lên Vercel

Ứng dụng **ThiDuaHS** được cấu hình theo mô hình Monorepo (Frontend và Backend riêng biệt nhưng nằm chung một repository). Khi triển khai lên Vercel, bạn sẽ tạo **2 dự án khác nhau trên Vercel** trỏ chung về một kho lưu trữ GitHub.

---

## 🚀 Bước 1: Triển khai Backend API (NestJS)

1. **Truy cập Vercel Dashboard**: Đăng nhập vào tài khoản [Vercel](https://vercel.com/) của bạn.
2. **Import Repository**:
   - Nhấn **Add New** -> **Project**.
   - Chọn kết nối với kho lưu trữ GitHub `bighieutin95/thiduaHS`.
3. **Cấu hình Project Settings**:
   - **Project Name**: Đặt tên dự án (ví dụ: `thiduahs-backend`).
   - **Framework Preset**: Chọn **Other** (Hệ thống sẽ tự nhận diện cấu hình `vercel.json` chạy NestJS serverless ở thư mục `/backend`).
   - **Root Directory**: Nhấp vào **Edit** và chọn thư mục `backend` -> Nhấn **Keep**.
4. **Cấu hình Environment Variables (Biến môi trường)**:
   Mở rộng mục **Environment Variables** và điền đầy đủ các biến sau:
   - `DATABASE_URL`: *Đường dẫn kết nối PostgreSQL của bạn (Shared pooler)*
   - `SUPABASE_URL`: `https://lhqzllnnzhdktesjlgwq.supabase.co`
   - `SUPABASE_ANON_KEY`: *Mã Anon Key của Supabase*
   - `PORT`: `3000`
   - `FRONTEND_URL`: *URL của dự án Frontend sau khi deploy (bạn có thể cập nhật biến này sau khi deploy xong Frontend)*
5. **Triển khai**:
   - Nhấn nút **Deploy**. Vercel sẽ tự động build và chạy API NestJS dưới dạng Serverless Functions.
   - Sau khi hoàn thành, sao chép URL backend do Vercel cấp (ví dụ: `https://thiduahs-backend.vercel.app`). URL API của bạn sẽ là `https://thiduahs-backend.vercel.app/api`.

---

## 🎨 Bước 2: Triển khai Frontend App (React + Vite)

1. **Tạo dự án mới trên Vercel**: Quay lại Vercel Dashboard, nhấn **Add New** -> **Project**.
2. **Import Repository**: Chọn lại kho lưu trữ GitHub `bighieutin95/thiduaHS`.
3. **Cấu hình Project Settings**:
   - **Project Name**: Đặt tên dự án (ví dụ: `thiduahs-frontend`).
   - **Framework Preset**: Chọn **Vite**.
   - **Root Directory**: Nhấp vào **Edit** và chọn thư mục `frontend` -> Nhấn **Keep**.
   - **Build Command**: Nhập `npm run build` (hoặc để mặc định Vite tự nhận diện).
4. **Cấu hình Environment Variables (Biến môi trường)**:
   Mở rộng mục **Environment Variables** và điền các biến sau:
   - `VITE_SUPABASE_URL`: `https://lhqzllnnzhdktesjlgwq.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: *Mã Anon Key của Supabase*
   - `VITE_BACKEND_URL`: Điền URL API backend bạn vừa deploy ở Bước 1 (Ví dụ: `https://thiduahs-backend.vercel.app/api`).
5. **Triển khai**:
   - Nhấn nút **Deploy**. Vercel sẽ build giao diện tĩnh của ứng dụng React và deploy lên CDN của họ.
   - Lưu lại URL của ứng dụng Frontend (Ví dụ: `https://thiduahs-frontend.vercel.app`).

---

## 🔗 Bước 3: Cấu hình liên kết & Google OAuth

Sau khi cả 2 dự án đã được deploy thành công, bạn cần thực hiện 2 cấu hình nhỏ sau để hệ thống chạy ổn định:

1. **Cập nhật CORS cho Backend**:
   - Quay lại trang quản lý dự án **Backend** trên Vercel -> Vào **Settings** -> **Environment Variables**.
   - Cập nhật biến môi trường `FRONTEND_URL` với giá trị là URL của dự án **Frontend** bạn vừa tạo (ví dụ: `https://thiduahs-frontend.vercel.app`).
   - Thực hiện Redeploy lại Backend để cập nhật cấu hình.
2. **Cập nhật Redirect URLs trên Supabase**:
   - Vào **Supabase Dashboard** -> Project của bạn -> Mục **Authentication** -> **URL Configuration**.
   - Ở phần **Site URL**, điền URL Frontend của bạn (ví dụ: `https://thiduahs-frontend.vercel.app`).
   - Ở phần **Redirect URLs**, thêm địa chỉ `https://thiduahs-frontend.vercel.app/*` để cho phép người dùng quay lại ứng dụng sau khi đăng nhập Google OAuth thành công.
