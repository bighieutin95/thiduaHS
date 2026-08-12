import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Award, AlertTriangle, UserCheck, TrendingUp, History, HelpCircle } from 'lucide-react';

interface LichSu {
  lich_su_id: string;
  nguoi_cham: { ho_ten: string };
  hoc_sinh: { ho_ten: string };
  tieu_chi: { ten_tieu_chi: string; loai: 'Cong' | 'Tru' };
  so_diem_thuc_te: string;
  ngay_vi_pham: string;
  mo_ta: string;
}

export default function Dashboard() {
  const { profile, isAdmin, isCanBoLop, isToTruong } = useAuth();
  const [history, setHistory] = useState<LichSu[]>([]);
  const [stats, setStats] = useState({
    diemHienTai: 100,
    tongCong: 0,
    tongTru: 0,
    viPhamPhoBien: 'Không đồng phục',
  });
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

  const fetchDashboardData = useCallback(async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
      // 1. Lấy lịch sử chấm điểm thi đua
      let url = `${BACKEND_URL}/emulation/history`;
      if (!isAdmin && profile.hoc_sinh) {
        // Học sinh chỉ được xem lịch sử chấm điểm của chính mình
        url += `?hoc_sinh_id=${profile.hoc_sinh.hoc_sinh_id}`;
      }
      const token = localStorage.getItem('sb-access-token'); // Lấy jwt token từ local storage
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data.slice(0, 5)); // Lấy 5 hoạt động gần nhất

        // 2. Tính toán thống kê nhanh
        if (profile.hoc_sinh) {
          let cong = 0;
          let tru = 0;
          data.forEach((item: any) => {
            if (item.trang_thai === 'HieuLuc') {
              if (item.tieu_chi.loai === 'Cong') {
                cong += Number(item.so_diem_thuc_te);
              } else {
                tru += Number(item.so_diem_thuc_te);
              }
            }
          });
          setStats({
            diemHienTai: 100 + cong - tru,
            tongCong: cong,
            tongTru: tru,
            viPhamPhoBien: data.find((item: any) => item.tieu_chi.loai === 'Tru')?.tieu_chi.ten_tieu_chi || 'Không có',
          });
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [profile, isAdmin, BACKEND_URL]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <h2>Bảng Tổng Quan Thi Đua</h2>
          <p>Chào mừng quay trở lại, {profile?.ho_ten}!</p>
        </div>
      </div>

      {/* Grid thẻ thống kê nhanh */}
      <div className="dashboard-grid">
        <div className="glass-card stat-card" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.02))' }}>
          <div className="stat-icon" style={{ color: 'var(--color-primary)' }}><Award size={48} /></div>
          <div className="stat-label">Điểm thi đua tuần này</div>
          <div className="stat-value gradient-text">{profile?.hoc_sinh ? stats.diemHienTai : 100}</div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Mặc định bắt đầu: 100đ</span>
        </div>

        <div className="glass-card stat-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))' }}>
          <div className="stat-icon" style={{ color: 'var(--color-success)' }}><TrendingUp size={48} /></div>
          <div className="stat-label">Tổng điểm cộng tích lũy</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>+{profile?.hoc_sinh ? stats.tongCong : 0}</div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Hoạt động tích cực xây dựng bài</span>
        </div>

        <div className="glass-card stat-card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.02))' }}>
          <div className="stat-icon" style={{ color: 'var(--color-danger)' }}><AlertTriangle size={48} /></div>
          <div className="stat-label">Tổng điểm bị trừ</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>-{profile?.hoc_sinh ? stats.tongTru : 0}</div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Lỗi nề nếp & chuyên cần</span>
        </div>

        <div className="glass-card stat-card" style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.02))' }}>
          <div className="stat-icon" style={{ color: 'var(--color-secondary)' }}><UserCheck size={48} /></div>
          <div className="stat-label">Vi phạm cần lưu ý</div>
          <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px' }}>
            {profile?.hoc_sinh ? stats.viPhamPhoBien : 'Chưa có'}
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Cần sửa đổi trong tuần tới</span>
        </div>
      </div>

      <div className="grid-2col">
        {/* Lịch sử hoạt động gần đây */}
        <div className="glass-card" style={{ padding: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-5)' }}>
            <History size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Hoạt động thi đua gần đây</h3>
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-10)', color: 'var(--text-secondary)' }}>
              <HelpCircle size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p>Chưa có lịch sử chấm điểm thi đua nào được ghi nhận trong tuần này.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Học sinh</th>
                    <th>Tiêu chí</th>
                    <th>Điểm</th>
                    <th>Ngày ghi nhận</th>
                    <th>Mô tả</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.lich_su_id}>
                      <td style={{ fontWeight: 600 }}>{item.hoc_sinh.ho_ten}</td>
                      <td>
                        <span className={`badge ${item.tieu_chi.loai === 'Cong' ? 'badge-success' : 'badge-danger'}`}>
                          {item.tieu_chi.ten_tieu_chi}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: item.tieu_chi.loai === 'Cong' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {item.tieu_chi.loai === 'Cong' ? '+' : '-'}{Number(item.so_diem_thuc_te)}đ
                      </td>
                      <td>{new Date(item.ngay_vi_pham).toLocaleDateString('vi-VN')}</td>
                      <td>{item.mo_ta || 'Không có mô tả'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Nội quy thi đua nhanh */}
        <div className="glass-card" style={{ padding: 'var(--spacing-6)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--spacing-4)' }}>Thông tin lưu ý</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--border-radius-md)', background: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid var(--color-warning)' }}>
              <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: '#d97706', marginBottom: '4px' }}>⏰ Hạn chốt điểm tuần</strong>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                Hệ thống tự động khóa sổ chốt điểm thi đua tuần vào lúc <strong>22h00 tối thứ Sáu hàng tuần</strong>. Ban cán sự lớp vui lòng chấm điểm đúng hạn.
              </p>
            </div>

            <div style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--border-radius-md)', background: 'rgba(37, 99, 235, 0.08)', borderLeft: '4px solid var(--color-primary)' }}>
              <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', marginBottom: '4px' }}>🛡️ Cơ chế tự quản</strong>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                Quyền hạn chấm điểm được phân bổ linh hoạt giữa Lớp trưởng, Lớp phó, Tổ trưởng và Tổ phó để đảm bảo tính phối hợp tự quản chặt chẽ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
