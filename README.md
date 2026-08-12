# ThiDuaHS - Hệ thống Chấm điểm Thi đua Học sinh

Ứng dụng web phục vụ chấm điểm thi đua học sinh hàng tuần và tổng hợp điểm cá nhân cuối tháng, thiết kế riêng cho hệ thống giáo dục phổ thông Việt Nam.

---

## 📚 Tài liệu dự án

> **AI / Developer đọc file này đầu tiên, rồi tiếp tục đọc `docs/CORE.md`**

| Tài liệu | Mô tả |
|---|---|
| [📌 CORE.md](./docs/CORE.md) | **Tài liệu cốt lõi** - Kiến trúc hệ thống, vai trò người dùng, quy tắc phát triển |
| [🗄️ DATABASE.md](./docs/DATABASE.md) | Thiết kế cơ sở dữ liệu, ERD, SQL Script khởi tạo, RLS Policies |
| [⚙️ BUSINESS_FLOW.md](./docs/BUSINESS_FLOW.md) | Luồng đăng nhập OAuth, chấm điểm, tự động chốt điểm 22h00 thứ Sáu |
| [🔗 API.md](./docs/API.md) | Tài liệu API Backend NestJS |
| [🔐 AUTH_SETUP.md](./docs/AUTH_SETUP.md) | Hướng dẫn thiết lập Google OAuth & Supabase Auth |

---

## 🛠️ Công nghệ sử dụng

| Layer | Công nghệ |
|---|---|
| **Frontend** | React + Vite + TypeScript + Vanilla CSS |
| **Backend** | NestJS + TypeORM + TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Google OAuth 2.0 + Supabase Auth |
| **Hosting** | Vercel (Monorepo) |

---

## 📁 Cấu trúc thư mục

```
/
├── docs/           # Tài liệu thiết kế (luôn cập nhật cùng code)
├── frontend/       # React + Vite app
├── backend/        # NestJS API
├── supabase/
│   └── migrations/ # SQL khởi tạo database
└── package.json    # Workspace root (npm workspaces)
```

---

## 🚀 Khởi chạy dự án

### 1. Cài đặt dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Cấu hình biến môi trường
```bash
# Backend
cp backend/.env.example backend/.env
# Điền các giá trị từ Supabase Dashboard vào backend/.env

# Frontend
cp frontend/.env.example frontend/.env
# Điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY
```

### 3. Chạy Database migrations
Truy cập **Supabase Dashboard → SQL Editor**, copy nội dung file `supabase/migrations/init.sql` và chạy.

### 4. Khởi động development server
```bash
# Chạy Backend
npm run dev:backend

# Chạy Frontend (terminal khác)
npm run dev:frontend
```

---

## 🌐 Deploy lên Vercel

Xem hướng dẫn chi tiết tại [AUTH_SETUP.md](./docs/AUTH_SETUP.md).

---

## 👥 Vai trò người dùng

| Vai trò | Mô tả |
|---|---|
| **Admin** | Ban Giám hiệu / Tổng phụ trách - Toàn quyền quản lý |
| **Lớp trưởng** | Chấm điểm toàn lớp |
| **Lớp phó** | Chấm điểm theo phân công |
| **Tổ trưởng** | Chấm điểm thành viên trong tổ |
| **Tổ phó** | Hỗ trợ chấm điểm trong tổ |
| **Học sinh** | Xem điểm và xếp loại cá nhân |

---

## ⏰ Tự động chốt điểm

Hệ thống tự động chốt điểm thi đua tuần vào **22h00 tối thứ Sáu hàng tuần** (Cron Job).

---

*Repository: https://github.com/bighieutin95/thiduaHS.git*
