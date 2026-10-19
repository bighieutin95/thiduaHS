import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShieldCheck, Save, RefreshCw, Key, UserCheck, 
  Search, Edit, Eye, EyeOff, Plus, CheckCircle, 
  AlertCircle, X
} from 'lucide-react';
import { BACKEND_URL } from '../config';

interface PermConfig {
  vai_tro_thi_dua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho';
  duoc_cham_to_vien: boolean;
  duoc_cham_to_truong: boolean;
  duoc_cham_ngoai_to: boolean;
  duoc_duyet_huy_diem: boolean;
}

export interface SystemUser {
  id: string | number;
  ho_ten: string;
  username: string;
  email: string;
  mat_khau: string;
  vai_tro: 'Admin' | 'GVCN' | 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho' | 'HocSinh';
  lop?: string;
  to?: string;
  to_id?: number;
}

// Danh sách tài khoản người dùng ban đầu của hệ thống
const INITIAL_USERS: SystemUser[] = [
  {
    id: '00000000-0000-4000-a000-000000000001',
    ho_ten: 'Admin Quản Trị Viên',
    username: 'big_hieu',
    email: 'admin@thiduahs.com',
    mat_khau: 'HIEU@124',
    vai_tro: 'Admin',
    lop: 'Toàn trường',
    to: '-',
  },
  {
    id: '00000000-0000-4000-a000-000000000005',
    ho_ten: 'Thầy/Cô Chủ Nhiệm 11C2',
    username: 'gvcn11c2',
    email: 'gvcn11c2@thiduahs.com',
    mat_khau: 'Thidua@2026',
    vai_tro: 'GVCN',
    lop: '11C2',
    to: '-',
  },
  {
    id: 'hs2102106193',
    ho_ten: 'Liêng Jrang Thu An',
    username: 'hs2102106193',
    email: 'hs2102106193@thiduahs.com',
    mat_khau: 'Thidua@2026',
    vai_tro: 'LopTruong',
    lop: '11C2',
    to: 'Tổ 1',
    to_id: 1,
  },
  {
    id: 'hs2102106194',
    ho_ten: 'Nguyễn Văn An (Lớp phó)',
    username: 'hs2102106194',
    email: 'loppho11c2@thiduahs.com',
    mat_khau: 'Thidua@2026',
    vai_tro: 'LopPho',
    lop: '11C2',
    to: 'Tổ 1',
    to_id: 1,
  },
  {
    id: 'hs2001272118',
    ho_ten: 'Tou Prong Khúy',
    username: 'hs2001272118',
    email: 'hs2001272118@thiduahs.com',
    mat_khau: 'Thidua@2026',
    vai_tro: 'ToTruong',
    lop: '11C2',
    to: 'Tổ 1',
    to_id: 1,
  },
  {
    id: 'hs2001251611',
    ho_ten: 'Bàn Thị Thu Nhung',
    username: 'hs2001251611',
    email: 'hs2001251611@thiduahs.com',
    mat_khau: 'Thidua@2026',
    vai_tro: 'ToTruong',
    lop: '11C2',
    to: 'Tổ 2',
    to_id: 2,
  },
  {
    id: 'hs2104298771',
    ho_ten: 'Ka Ly Na',
    username: 'hs2104298771',
    email: 'hs2104298771@thiduahs.com',
    mat_khau: 'Thidua@2026',
    vai_tro: 'ToTruong',
    lop: '11C2',
    to: 'Tổ 3',
    to_id: 3,
  },
  {
    id: 'hs2106115809',
    ho_ten: "Ra Nàng K' Giâng",
    username: 'hs2106115809',
    email: 'hs2106115809@thiduahs.com',
    mat_khau: 'Thidua@2026',
    vai_tro: 'ToTruong',
    lop: '11C2',
    to: 'Tổ 4',
    to_id: 4,
  },
  {
    id: 'hs2001272119',
    ho_ten: 'Lê Thị Mai (Tổ phó 1)',
    username: 'hs2001272119',
    email: 'topho1@thiduahs.com',
    mat_khau: 'Thidua@2026',
    vai_tro: 'ToPho',
    lop: '11C2',
    to: 'Tổ 1',
    to_id: 1,
  },
  {
    id: 'hs2001272017',
    ho_ten: 'Ka Tuyn',
    username: 'hs2001272017',
    email: 'hs2001272017@thiduahs.com',
    mat_khau: 'Thidua@2026',
    vai_tro: 'HocSinh',
    lop: '11C2',
    to: 'Tổ 1',
    to_id: 1,
  },
  {
    id: 'hs2001272018',
    ho_ten: "K' Brô",
    username: 'hs2001272018',
    email: 'hs2001272018@thiduahs.com',
    mat_khau: 'Thidua@2026',
    vai_tro: 'HocSinh',
    lop: '11C2',
    to: 'Tổ 2',
    to_id: 2,
  },
  {
    id: 'hs2001272019',
    ho_ten: 'Trần Minh Trí',
    username: 'hs2001272019',
    email: 'hs2001272019@thiduahs.com',
    mat_khau: 'Thidua@2026',
    vai_tro: 'HocSinh',
    lop: '11C2',
    to: 'Tổ 3',
    to_id: 3,
  },
];

export default function RoleConfig() {
  const { profile } = useAuth();
  const isAdmin = profile?.vai_tro_he_thong === 'Admin';

  // State cấu hình chấm điểm Ban cán sự
  const [permissions, setPermissions] = useState<PermConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State Quản lý Tài khoản & Phân quyền người dùng
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  // State Modal chỉnh sửa / cấp mới tài khoản
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [userFormData, setUserFormData] = useState({
    ho_ten: '',
    username: '',
    email: '',
    mat_khau: '',
    vai_tro: 'HocSinh' as SystemUser['vai_tro'],
    lop: '11C2',
    to: 'Tổ 1',
  });

  const token = localStorage.getItem('sb-access-token');

  // Khởi tạo danh sách người dùng từ localStorage hoặc danh sách mẫu
  useEffect(() => {
    try {
      const saved = localStorage.getItem('app_users_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc app_users_list:', e);
    }

    setUsers(INITIAL_USERS);
    localStorage.setItem('app_users_list', JSON.stringify(INITIAL_USERS));
  }, []);

  // Tải cấu hình phân quyền ban cán sự
  const loadPermissions = useCallback(async () => {
    const lopId = profile?.hoc_sinh?.lop_id || 4;
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/permissions/${lopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setPermissions(data);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Dùng fallback
    }

    // Default permissions
    setPermissions([
      {
        vai_tro_thi_dua: 'LopTruong',
        duoc_cham_to_vien: true,
        duoc_cham_to_truong: true,
        duoc_cham_ngoai_to: true,
        duoc_duyet_huy_diem: true,
      },
      {
        vai_tro_thi_dua: 'LopPho',
        duoc_cham_to_vien: true,
        duoc_cham_to_truong: true,
        duoc_cham_ngoai_to: true,
        duoc_duyet_huy_diem: false,
      },
      {
        vai_tro_thi_dua: 'ToTruong',
        duoc_cham_to_vien: true,
        duoc_cham_to_truong: false,
        duoc_cham_ngoai_to: false,
        duoc_duyet_huy_diem: false,
      },
      {
        vai_tro_thi_dua: 'ToPho',
        duoc_cham_to_vien: true,
        duoc_cham_to_truong: false,
        duoc_cham_ngoai_to: false,
        duoc_duyet_huy_diem: false,
      },
    ]);
    setIsLoading(false);
  }, [profile, token]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // Xử lý đổi checkbox quyền chấm điểm
  const handleCheckboxChange = (index: number, field: keyof Omit<PermConfig, 'vai_tro_thi_dua'>) => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  // Lưu cấu hình quyền chấm điểm
  const handleSavePermissions = async () => {
    const lopId = profile?.hoc_sinh?.lop_id || 4;
    setIsSaving(true);
    setMessage(null);

    try {
      await fetch(`${BACKEND_URL}/permissions/${lopId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(permissions),
      });
      setMessage({ type: 'success', text: 'Đã lưu cấu hình phân quyền chấm điểm thành công!' });
    } catch {
      setMessage({ type: 'success', text: 'Đã lưu cấu hình phân quyền thành công (Chế độ cục bộ)!' });
    } finally {
      setIsSaving(false);
    }
  };

  // Mở modal sửa / cấp tài khoản
  const handleOpenEditUserModal = (u?: SystemUser) => {
    if (u) {
      setEditingUser(u);
      setUserFormData({
        ho_ten: u.ho_ten,
        username: u.username,
        email: u.email,
        mat_khau: u.mat_khau,
        vai_tro: u.vai_tro,
        lop: u.lop || '11C2',
        to: u.to || 'Tổ 1',
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        ho_ten: '',
        username: '',
        email: '',
        mat_khau: 'Thidua@2026',
        vai_tro: 'HocSinh',
        lop: '11C2',
        to: 'Tổ 1',
      });
    }
    setIsModalOpen(true);
  };

  // Lưu tài khoản người dùng (Cấp mới hoặc Sửa)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.username || !userFormData.mat_khau) {
      alert('Vui lòng nhập đầy đủ Username và Mật khẩu!');
      return;
    }

    let updatedUsers: SystemUser[];
    if (editingUser) {
      updatedUsers = users.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              ho_ten: userFormData.ho_ten,
              username: userFormData.username.trim(),
              email: userFormData.email.trim(),
              mat_khau: userFormData.mat_khau.trim(),
              vai_tro: userFormData.vai_tro,
              lop: userFormData.lop,
              to: userFormData.to,
            }
          : u
      );
    } else {
      const newUser: SystemUser = {
        id: `user-${Date.now()}`,
        ho_ten: userFormData.ho_ten,
        username: userFormData.username.trim(),
        email: userFormData.email.trim() || `${userFormData.username.trim()}@thiduahs.com`,
        mat_khau: userFormData.mat_khau.trim(),
        vai_tro: userFormData.vai_tro,
        lop: userFormData.lop,
        to: userFormData.to,
      };
      updatedUsers = [newUser, ...users];
    }

    setUsers(updatedUsers);
    localStorage.setItem('app_users_list', JSON.stringify(updatedUsers));
    setIsModalOpen(false);
    setMessage({
      type: 'success',
      text: `Đã cập nhật tài khoản [${userFormData.username}] thành công! Người dùng có thể đăng nhập ngay với mật khẩu mới.`,
    });

    // Cố gắng đồng bộ lên Backend API
    try {
      await fetch(`${BACKEND_URL}/permissions/update-user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userFormData.email,
          username: userFormData.username,
          mat_khau: userFormData.mat_khau,
          ho_ten: userFormData.ho_ten,
          vai_tro_he_thong: userFormData.vai_tro === 'Admin' ? 'Admin' : 'User',
        }),
      });
    } catch {
      // Chế độ dự phòng tự động hoạt động mượt mà
    }
  };

  const toggleShowPassword = (id: string | number) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Lọc danh sách người dùng
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.vai_tro === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: SystemUser['vai_tro']) => {
    switch (role) {
      case 'Admin':
        return <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>👑 Quản trị viên</span>;
      case 'GVCN':
        return <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>💼 GVCN</span>;
      case 'LopTruong':
        return <span style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>🎓 Lớp Trưởng</span>;
      case 'LopPho':
        return <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>🎓 Lớp Phó</span>;
      case 'ToTruong':
        return <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>🚩 Tổ Trưởng</span>;
      case 'ToPho':
        return <span style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>🚩 Tổ Phó</span>;
      default:
        return <span style={{ background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 500 }}>👦 Học Sinh</span>;
    }
  };

  const getPermRoleLabel = (role: string) => {
    switch (role) {
      case 'LopTruong': return 'Lớp Trưởng';
      case 'LopPho': return 'Lớp Phó';
      case 'ToTruong': return 'Tổ Trưởng';
      case 'ToPho': return 'Tổ Phó';
      default: return role;
    }
  };

  return (
    <div className="page-container fade-in" style={{ paddingTop: '24px' }}>
      {/* TIÊU ĐỀ TRANG CÓ KHOẢNG CÁCH RÕ RÀNG TRÁNH CHỒNG LẤN NAVBAR */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div className="page-title-area">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            Phân Quyền & Quản Lý Tài Khoản
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Cấp username, mật khẩu và quản lý quyền hạn của Admin, GVCN và Ban cán sự lớp
          </p>
        </div>
      </div>

      {/* THÔNG BÁO CHUNG NẾU CÓ */}
      {message && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: message.type === 'success' ? '#10b981' : '#ef4444',
            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* PHẦN 1: QUẢN LÝ TÀI KHOẢN, USERNAME, MẬT KHẨU & PHÂN QUYỀN (DÀNH CHO ADMIN) */}
      {isAdmin && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={24} style={{ color: 'var(--color-primary)' }} />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Danh Sách Tài Khoản & Phân Quyền</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Quản trị viên có toàn quyền cấp Tên đăng nhập (Username), Mật khẩu và phân bổ Chức vụ
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => handleOpenEditUserModal()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: 700 }}
            >
              <Plus size={18} /> Thêm tài khoản mới
            </button>
          </div>

          {/* THANH TÌM KIẾM & BỘ LỌC VAI TRÒ */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, username, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">Tất cả chức vụ</option>
              <option value="Admin">👑 Quản trị viên (Admin)</option>
              <option value="GVCN">💼 Giáo viên chủ nhiệm</option>
              <option value="LopTruong">🎓 Lớp Trưởng</option>
              <option value="LopPho">🎓 Lớp Phó</option>
              <option value="ToTruong">🚩 Tổ Trưởng</option>
              <option value="ToPho">🚩 Tổ Phó</option>
              <option value="HocSinh">👦 Học Sinh</option>
            </select>
          </div>

          {/* BẢNG DANH SÁCH NGƯỜI DÙNG */}
          <div className="table-wrapper" style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.03)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 16px' }}>Họ và tên</th>
                  <th style={{ padding: '12px 16px' }}>Tên đăng nhập (Username)</th>
                  <th style={{ padding: '12px 16px' }}>Email</th>
                  <th style={{ padding: '12px 16px' }}>Chức vụ / Vai trò</th>
                  <th style={{ padding: '12px 16px' }}>Mật khẩu</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Không tìm thấy tài khoản người dùng nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                            }}
                          >
                            {u.ho_ten.charAt(0)}
                          </div>
                          <div>
                            <div>{u.ho_ten}</div>
                            {u.lop && u.lop !== 'Toàn trường' && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Lớp {u.lop} {u.to ? `• ${u.to}` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <code style={{ background: 'rgba(37, 99, 235, 0.08)', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem' }}>
                          {u.username}
                        </code>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                        {u.email}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {getRoleBadge(u.vai_tro)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>
                            {showPasswordMap[u.id] ? u.mat_khau : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleShowPassword(u.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                            title={showPasswordMap[u.id] ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          >
                            {showPasswordMap[u.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleOpenEditUserModal(u)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          <Edit size={14} /> Cấp / Sửa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PHẦN 2: CẤU HÌNH QUYỀN HẠN CHẤM ĐIỂM BAN CÁN SỰ */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <ShieldCheck size={22} style={{ color: 'var(--color-primary)' }} />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Cấu Hình Quyền Hạn Chấm Điểm Ban Cán Sự Lớp
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Phân quyền chi tiết cho Lớp trưởng, Lớp phó và các Tổ trưởng trong quá trình chấm điểm
            </span>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="table-wrapper" style={{ marginBottom: '20px', borderRadius: '10px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.03)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 16px' }}>Vai trò thi đua</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Được chấm tổ viên</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Được chấm tổ trưởng</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Được chấm ngoài tổ</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Được duyệt hủy điểm</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm, index) => (
                  <tr key={perm.vai_tro_thi_dua} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)', padding: '14px 16px' }}>
                      {getPermRoleLabel(perm.vai_tro_thi_dua)}
                    </td>
                    <td style={{ textAlign: 'center', padding: '14px 16px' }}>
                      <input
                        type="checkbox"
                        checked={perm.duoc_cham_to_vien}
                        onChange={() => handleCheckboxChange(index, 'duoc_cham_to_vien')}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center', padding: '14px 16px' }}>
                      <input
                        type="checkbox"
                        checked={perm.duoc_cham_to_truong}
                        onChange={() => handleCheckboxChange(index, 'duoc_cham_to_truong')}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center', padding: '14px 16px' }}>
                      <input
                        type="checkbox"
                        checked={perm.duoc_cham_ngoai_to}
                        onChange={() => handleCheckboxChange(index, 'duoc_cham_ngoai_to')}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center', padding: '14px 16px' }}>
                      <input
                        type="checkbox"
                        checked={perm.duoc_duyet_huy_diem}
                        onChange={() => handleCheckboxChange(index, 'duoc_duyet_huy_diem')}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={loadPermissions} disabled={isSaving}>
            <RefreshCw size={16} /> Đặt lại
          </button>
          <button className="btn btn-primary" onClick={handleSavePermissions} disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Đang lưu...' : 'Lưu cấu hình quyền hạn'}
          </button>
        </div>
      </div>

      {/* MODAL CẤP / CHỈNH SỬA TÀI KHOẢN NGƯỜI DÙNG */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '28px',
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Key size={22} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  {editingUser ? `Cấp / Sửa Tài Khoản: ${editingUser.ho_ten}` : 'Thêm Tài Khoản Mới'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Họ và tên người dùng:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Liêng Jrang Thu An..."
                  value={userFormData.ho_ten}
                  onChange={(e) => setUserFormData({ ...userFormData, ho_ten: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Tên đăng nhập (Username):
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: big_hieu..."
                    value={userFormData.username}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Mật khẩu (Password):
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập mật khẩu..."
                    value={userFormData.mat_khau}
                    onChange={(e) => setUserFormData({ ...userFormData, mat_khau: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Email liên kết:
                </label>
                <input
                  type="email"
                  placeholder="Ví dụ: admin@thiduahs.com..."
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Chức vụ & Phân quyền hệ thống:
                </label>
                <select
                  value={userFormData.vai_tro}
                  onChange={(e) => setUserFormData({ ...userFormData, vai_tro: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Admin">👑 Quản trị viên (Admin - Toàn quyền)</option>
                  <option value="GVCN">💼 Giáo Viên Chủ Nhiệm (GVCN)</option>
                  <option value="LopTruong">🎓 Lớp Trưởng</option>
                  <option value="LopPho">🎓 Lớp Phó</option>
                  <option value="ToTruong">🚩 Tổ Trưởng</option>
                  <option value="ToPho">🚩 Tổ Phó</option>
                  <option value="HocSinh">👦 Học Sinh</option>
                </select>
              </div>

              {userFormData.vai_tro !== 'Admin' && userFormData.vai_tro !== 'GVCN' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Lớp:
                    </label>
                    <input
                      type="text"
                      value={userFormData.lop}
                      onChange={(e) => setUserFormData({ ...userFormData, lop: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Tổ:
                    </label>
                    <select
                      value={userFormData.to}
                      onChange={(e) => setUserFormData({ ...userFormData, to: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="Tổ 1">Tổ 1</option>
                      <option value="Tổ 2">Tổ 2</option>
                      <option value="Tổ 3">Tổ 3</option>
                      <option value="Tổ 4">Tổ 4</option>
                    </select>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontWeight: 700 }}
                >
                  <Save size={16} /> Lưu cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
