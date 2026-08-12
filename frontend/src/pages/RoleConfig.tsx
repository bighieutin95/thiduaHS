import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Save, RefreshCw } from 'lucide-react';

interface PermConfig {
  vai_tro_thi_dua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho';
  duoc_cham_to_vien: boolean;
  duoc_cham_to_truong: boolean;
  duoc_cham_ngoai_to: boolean;
  duoc_duyet_huy_diem: boolean;
}

export default function RoleConfig() {
  const { profile } = useAuth();
  const [permissions, setPermissions] = useState<PermConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';
  const token = localStorage.getItem('sb-access-token');

  const loadPermissions = useCallback(async () => {
    if (!profile?.hoc_sinh) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/permissions/${profile.hoc_sinh.lop_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setPermissions(data);
        } else {
          // Mock data default nếu chưa có config trong Database
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
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [profile, token, BACKEND_URL]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const handleCheckboxChange = (index: number, field: keyof Omit<PermConfig, 'vai_tro_thi_dua'>) => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  const handleSave = async () => {
    if (!profile?.hoc_sinh) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`${BACKEND_URL}/permissions/${profile.hoc_sinh.lop_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(permissions),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Cấu hình phân quyền đã được cập nhật thành công!' });
      } else {
        setMessage({ type: 'error', text: 'Cập nhật phân quyền thất bại.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'LopTruong': return 'Lớp Trưởng';
      case 'LopPho': return 'Lớp Phó';
      case 'ToTruong': return 'Tổ Trưởng';
      case 'ToPho': return 'Tổ Phó';
      default: return role;
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <h2>Phân Quyền Ban Cán Sự Lớp</h2>
          <p>Thiết lập chi tiết quyền hạn chấm điểm thi đua và xử lý điểm cho từng chức vụ</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Trang Cấu Hình Phân Quyền</h3>
        </div>

        {message && (
          <div
            style={{
              padding: 'var(--spacing-3)',
              borderRadius: 'var(--border-radius-md)',
              marginBottom: '20px',
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.type === 'success' ? '#059669' : '#dc2626',
              border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
              fontSize: 'var(--font-size-sm)',
            }}
          >
            {message.text}
          </div>
        )}

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="table-wrapper" style={{ marginBottom: '20px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vai trò thi đua</th>
                  <th style={{ textAlign: 'center' }}>Được chấm tổ viên</th>
                  <th style={{ textAlign: 'center' }}>Được chấm tổ trưởng</th>
                  <th style={{ textAlign: 'center' }}>Được chấm ngoài tổ</th>
                  <th style={{ textAlign: 'center' }}>Được duyệt hủy điểm</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm, index) => (
                  <tr key={perm.vai_tro_thi_dua}>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      {getRoleLabel(perm.vai_tro_thi_dua)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={perm.duoc_cham_to_vien}
                        onChange={() => handleCheckboxChange(index, 'duoc_cham_to_vien')}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={perm.duoc_cham_to_truong}
                        onChange={() => handleCheckboxChange(index, 'duoc_cham_to_truong')}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={perm.duoc_cham_ngoai_to}
                        onChange={() => handleCheckboxChange(index, 'duoc_cham_ngoai_to')}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
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
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
          </button>
        </div>
      </div>
    </div>
  );
}
