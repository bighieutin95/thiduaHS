import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Award, AlertTriangle, UserCheck, TrendingUp, History, HelpCircle, Trophy } from 'lucide-react';

interface LichSu {
  lich_su_id: string;
  nguoi_cham: { ho_ten: string };
  hoc_sinh: { ho_ten: string };
  tieu_chi: { ten_tieu_chi: string; loai: 'Cong' | 'Tru' };
  so_diem_thuc_te: string;
  ngay_vi_pham: string;
  mo_ta: string;
}

interface RealtimeRank {
  hoc_sinh: {
    hoc_sinh_id: number;
    ho_ten: string;
    ma_hoc_sinh: string;
    to_id: number;
    ten_to?: string;
  };
  diem_cuoi_cung: number;
  tong_diem_cong: number;
  tong_diem_tru: number;
}

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();
  const [history, setHistory] = useState<LichSu[]>([]);
  const [realtimeRanking, setRealtimeRanking] = useState<RealtimeRank[]>([]);
  const [stats, setStats] = useState({
    diemHienTai: 100,
    tongCong: 0,
    tongTru: 0,
    viPhamPhoBien: 'Không có',
  });
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

  const getTuanThu = (date: Date): number => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  };

  const fetchDashboardData = useCallback(async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('sb-access-token');
      
      // 1. Lấy lịch sử chấm điểm thi đua
      let url = `${BACKEND_URL}/emulation/history`;
      if (!isAdmin && profile.hoc_sinh) {
        url += `?hoc_sinh_id=${profile.hoc_sinh.hoc_sinh_id}`;
      }
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data.slice(0, 5));

        // Tính toán thống kê cá nhân
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

      // 2. Lấy bảng điểm thời gian thực của lớp học (cho học sinh/GVCN/cán bộ lớp)
      const lopId = profile.gvcn_lop?.lop_id || profile.hoc_sinh?.lop_id;
      if (lopId) {
        const currentWeek = getTuanThu(new Date());
        const rankRes = await fetch(`${BACKEND_URL}/emulation/reports/realtime-weekly?lop_id=${lopId}&tuan_thu=${currentWeek}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (rankRes.ok) {
          const rankData = await rankRes.json();
          setRealtimeRanking(rankData);
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

  // Lấy thông tin điểm cá nhân nếu có, hoặc lấy điểm lớp của GVCN
  const hasHocSinh = !!profile?.hoc_sinh;
  const isGvcn = !!profile?.gvcn_lop;

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <h2>Bảng Tổng Quan Thi Đua</h2>
          <p>
            Chào mừng quay trở lại, <strong style={{ color: 'var(--color-primary)' }}>{profile?.ho_ten}</strong>
            {isGvcn && ` (Giáo viên chủ nhiệm lớp ${profile.gvcn_lop?.ten_lop})`}
          </p>
        </div>
      </div>

      {/* Grid thẻ thống kê nhanh (Chỉ hiển thị chỉ số cá nhân nếu là Học sinh) */}
      {hasHocSinh && (
        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="glass-card stat-card" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.02))' }}>
            <div className="stat-icon" style={{ color: 'var(--color-primary)' }}><Award size={48} /></div>
            <div className="stat-label">Điểm thi đua tạm tính tuần này</div>
            <div className="stat-value gradient-text">{stats.diemHienTai}</div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Mặc định bắt đầu: 100đ</span>
          </div>

          <div className="glass-card stat-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))' }}>
            <div className="stat-icon" style={{ color: 'var(--color-success)' }}><TrendingUp size={48} /></div>
            <div className="stat-label">Điểm cộng tuần này</div>
            <div className="stat-value" style={{ color: 'var(--color-success)' }}>+{stats.tongCong}</div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Thành tích & đóng góp tích cực</span>
          </div>

          <div className="glass-card stat-card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.02))' }}>
            <div className="stat-icon" style={{ color: 'var(--color-danger)' }}><AlertTriangle size={48} /></div>
            <div className="stat-label">Điểm bị trừ tuần này</div>
            <div className="stat-value" style={{ color: 'var(--color-danger)' }}>-{stats.tongTru}</div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Các vi phạm nội quy lớp</span>
          </div>

          <div className="glass-card stat-card" style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.02))' }}>
            <div className="stat-icon" style={{ color: 'var(--color-secondary)' }}><UserCheck size={48} /></div>
            <div className="stat-label">Lỗi cần lưu ý</div>
            <div className="stat-value" style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '8px', color: 'white' }}>
              {stats.viPhamPhoBien}
            </div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Chú ý khắc phục nề nếp</span>
          </div>
        </div>
      )}

      <div className="grid-2col">
        {/* Lịch sử hoạt động gần đây */}
        <div className="glass-card" style={{ padding: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-5)' }}>
            <History size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
              {hasHocSinh ? 'Nhật ký thi đua của bạn' : 'Hoạt động thi đua gần đây'}
            </h3>
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-10)', color: 'var(--text-secondary)' }}>
              <HelpCircle size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p>Chưa có ghi nhận thi đua nào được lưu trong tuần này.</p>
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
                    <th>Chi tiết</th>
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
                      <td>{item.mo_ta || 'Không có'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* BẢNG XẾP HẠNG LỚP THỜI GIAN THỰC */}
        <div className="glass-card" style={{ padding: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} style={{ color: '#fbbf24' }} />
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
                Xếp Hạng Lớp Tuần Hiện Tại (Tạm Tính)
              </h3>
            </div>
            <span className="badge badge-amber">Tuần {getTuanThu(new Date())}</span>
          </div>

          {realtimeRanking.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-10)', color: 'var(--text-secondary)' }}>
              <HelpCircle size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p>Chưa có dữ liệu xếp hạng của lớp học.</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>Hạng</th>
                    <th>Học sinh</th>
                    <th>Tổ</th>
                    <th style={{ textAlign: 'center' }}>Cộng / Trừ</th>
                    <th style={{ textAlign: 'right' }}>Tổng Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {realtimeRanking.map((rank, idx) => {
                    const isCurrentUser = rank.hoc_sinh.hoc_sinh_id === profile?.hoc_sinh?.hoc_sinh_id;
                    return (
                      <tr 
                        key={rank.hoc_sinh.hoc_sinh_id}
                        style={{ 
                          background: isCurrentUser ? 'rgba(96, 165, 250, 0.12)' : 'transparent',
                          borderLeft: isCurrentUser ? '3px solid #60a5fa' : 'none'
                        }}
                      >
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </td>
                        <td style={{ fontWeight: 600, color: isCurrentUser ? '#60a5fa' : 'white' }}>
                          {rank.hoc_sinh.ho_ten} {isCurrentUser && ' (Bạn)'}
                        </td>
                        <td>Tổ {rank.hoc_sinh.to_id}</td>
                        <td style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--color-success)' }}>+{rank.tong_diem_cong}</span>
                          <span style={{ color: 'var(--text-muted)' }}> / </span>
                          <span style={{ color: 'var(--color-danger)' }}>-{rank.tong_diem_tru}</span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: rank.diem_cuoi_cung >= 100 ? '#34d399' : '#f87171' }}>
                          {rank.diem_cuoi_cung}đ
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Nội quy & Thông báo chốt điểm */}
      <div className="glass-card" style={{ padding: 'var(--spacing-5)', marginTop: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--border-radius-md)', background: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid var(--color-warning)' }}>
            <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: '#d97706', marginBottom: '4px' }}>⏰ Khóa Sổ & Tổng Kết Điểm Tuần</strong>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Hệ thống sẽ tự động khóa sổ, chốt điểm thi đua chính thức của tuần vào lúc <strong>22h00 tối thứ Sáu hàng tuần</strong>. Điểm số hiển thị trên đây là điểm tạm tính thời gian thực.
            </p>
          </div>

          <div style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--border-radius-md)', background: 'rgba(37, 99, 235, 0.08)', borderLeft: '4px solid var(--color-primary)' }}>
            <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', marginBottom: '4px' }}>🛡️ Quy Tắc Xem Điểm Lớp Học</strong>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Học sinh chỉ được phép theo dõi điểm số thi đua cá nhân và bảng xếp hạng danh sách của lớp mình. Quyền Chấm điểm thi đua được ẩn hoàn toàn để bảo đảm sự nghiêm túc tự quản.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
