import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Award, AlertTriangle, UserCheck, TrendingUp, History, HelpCircle, Trophy } from 'lucide-react';
import { BACKEND_URL } from '../config';
import RoleAvatar from '../components/RoleAvatar';
import { DEFAULT_STUDENTS_11C2, DEFAULT_GRADE_RECORDS, getStoredData } from '../lib/mockData';

interface LichSu {
  lich_su_id: string;
  nguoi_cham: { ho_ten: string };
  hoc_sinh: { ho_ten: string };
  tieu_chi: { ten_tieu_chi: string; loai: 'Cong' | 'Tru' };
  so_diem_thuc_te: string;
  ngay_vi_pham: string;
  mo_ta: string;
  tuan_thu: number;
}

interface RealtimeRank {
  hoc_sinh: {
    hoc_sinh_id: number;
    ho_ten: string;
    ma_hoc_sinh: string;
    to_id: number;
    to?: {
      to_id: number;
      ten_to: string;
    };
  };
  diem_cuoi_cung: number;
  tong_diem_cong: number;
  tong_diem_tru: number;
}

export default function Dashboard() {
  const { profile, isAdmin, isCanBoLop, isToTruong } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState<LichSu[]>([]);
  const [realtimeRanking, setRealtimeRanking] = useState<RealtimeRank[]>([]);
  const [stats, setStats] = useState({
    diemHienTai: 100,
    tongCong: 0,
    tongTru: 0,
    viPhamPhoBien: 'Không có',
  });
  const [isLoading, setIsLoading] = useState(true);

  const getTuanThu = (date: Date): number => {
    const baseDate = new Date(2026, 8, 5); // 05/09/2026
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    const diffTime = d1.getTime() - d2.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return 1 + Math.floor(diffDays / 7);
  };

  const fetchDashboardData = useCallback(async () => {
    if (!profile) return;
    setIsLoading(true);
    const lopId = profile.gvcn_lop?.lop_id || profile.hoc_sinh?.lop_id || 4;
    const currentWeek = getTuanThu(new Date());

    try {
      const token = localStorage.getItem('sb-access-token');

      // 1. Lấy lịch sử chấm điểm thi đua
      let url = `${BACKEND_URL}/emulation/history`;
      if (!isAdmin) {
        if (profile.hoc_sinh && profile.hoc_sinh.vai_tro_thi_dua === 'HocSinh') {
          url += `?hoc_sinh_id=${profile.hoc_sinh.hoc_sinh_id}`;
        } else if (lopId) {
          url += `?lop_id=${lopId}`;
        }
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setHistory(data.slice(0, 15));
          if (profile.hoc_sinh) {
            let cong = 0;
            let tru = 0;
            data.forEach((item: any) => {
              if (item.trang_thai === 'HieuLuc' && item.tuan_thu === currentWeek) {
                if (item.tieu_chi.loai === 'Cong') cong += Number(item.so_diem_thuc_te);
                else tru += Number(item.so_diem_thuc_te);
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
      }
    } catch {
      // fallback handled below
    }

    // Fallback lịch sử từ mockData
    const storedHistory = getStoredData<any[]>('app_grade_records', DEFAULT_GRADE_RECORDS as any);
    setHistory(storedHistory);

    // Tính toán thống kê từ storedHistory
    let myCong = 0;
    let myTru = 0;
    const myName = profile.ho_ten;
    storedHistory.forEach((item: any) => {
      if (item.trang_thai !== 'BiHuy' && (!profile.hoc_sinh || item.hoc_sinh?.ho_ten === myName)) {
        if (item.tieu_chi?.loai === 'Cong') myCong += Number(item.so_diem_thuc_te || 0);
        else myTru += Number(item.so_diem_thuc_te || 0);
      }
    });

    setStats({
      diemHienTai: 100 + myCong - myTru,
      tongCong: myCong,
      tongTru: myTru,
      viPhamPhoBien: storedHistory.find((item: any) => item.tieu_chi?.loai === 'Tru')?.tieu_chi?.ten_tieu_chi || 'Không có',
    });

    // Fallback bảng xếp hạng thời gian thực của lớp
    const fallbackStudents = getStoredData<any[]>(`students_lop_${lopId}`, DEFAULT_STUDENTS_11C2);
    const rankList: RealtimeRank[] = fallbackStudents.map((hs) => {
      const studentRecs = storedHistory.filter(
        (r) => r.hoc_sinh?.ho_ten === hs.ho_ten && r.trang_thai !== 'BiHuy'
      );
      let cong = 0;
      let tru = 0;
      studentRecs.forEach((r) => {
        const pts = parseFloat(r.so_diem_thuc_te) || 0;
        if (r.tieu_chi?.loai === 'Cong') cong += pts;
        else tru += pts;
      });

      return {
        hoc_sinh: {
          hoc_sinh_id: hs.hoc_sinh_id,
          ho_ten: hs.ho_ten,
          ma_hoc_sinh: hs.ma_hoc_sinh || '',
          to_id: hs.to_id || 1,
          to: { to_id: hs.to_id || 1, ten_to: hs.to?.ten_to || `Tổ ${hs.to_id || 1}` },
        },
        diem_cuoi_cung: 100 + cong - tru,
        tong_diem_cong: cong,
        tong_diem_tru: tru,
      };
    });

    rankList.sort((a, b) => b.diem_cuoi_cung - a.diem_cuoi_cung);
    setRealtimeRanking(rankList);
    setIsLoading(false);
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

  const hasHocSinh = !!profile?.hoc_sinh;
  const isGvcn = !!profile?.gvcn_lop;
  const canGrade = isAdmin || isCanBoLop || isToTruong || isGvcn;

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

      {/* BANNER CHẤM ĐIỂM NHANH CHO BAN CÁN SỰ / GVCN */}
      {canGrade && (
        <div 
          className="glass-card" 
          style={{ 
            padding: '16px 20px', 
            marginBottom: '1.5rem', 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(96, 165, 250, 0.05))',
            borderLeft: '4px solid #3b82f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <h4 style={{ fontWeight: 700, color: 'white', marginBottom: '4px', fontSize: '1rem' }}>
              ⚡ Bạn đang đăng nhập với quyền Chấm điểm thi đua
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Ghi nhận điểm cộng thành tích hoặc lỗi vi phạm nề nếp cho học sinh lớp {profile?.hoc_sinh?.ten_lop || profile?.gvcn_lop?.ten_lop || '11C2'}
            </p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/grading')}
            style={{ 
              background: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              fontWeight: 'bold', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Chấm Điểm Thi Đua
          </button>
        </div>
      )}

      {/* Grid thẻ thống kê nhanh cho học sinh */}
      {hasHocSinh && (
        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="glass-card stat-card" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.02))' }}>
            <div className="stat-icon" style={{ color: 'var(--color-primary)' }}><Award size={48} /></div>
            <div className="stat-label">Điểm tuần này (Tạm tính)</div>
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
              {hasHocSinh && profile?.hoc_sinh?.vai_tro_thi_dua === 'HocSinh' ? 'Lịch sử vi phạm & điểm cộng của bạn' : 'Hoạt động thi đua gần đây'}
            </h3>
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-10)', color: 'var(--text-secondary)' }}>
              <HelpCircle size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p>Chưa có ghi nhận thi đua nào được lưu trong tuần này.</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Học sinh</th>
                    <th>Tiêu chí</th>
                    <th>Điểm</th>
                    <th style={{ textAlign: 'center' }}>Tuần</th>
                    <th>Ngày xảy ra</th>
                    <th>Mô tả</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.lich_su_id}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <RoleAvatar role="HocSinh" size={24} />
                          <span>{item.hoc_sinh.ho_ten}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${item.tieu_chi.loai === 'Cong' ? 'badge-success' : 'badge-danger'}`}>
                          {item.tieu_chi.ten_tieu_chi}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: item.tieu_chi.loai === 'Cong' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {item.tieu_chi.loai === 'Cong' ? '+' : '-'}{Number(item.so_diem_thuc_te)}đ
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.tuan_thu}</td>
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
                        <td style={{ fontWeight: 600, color: isCurrentUser ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RoleAvatar role="HocSinh" size={24} />
                            <span>{rank.hoc_sinh.ho_ten} {isCurrentUser && ' (Bạn)'}</span>
                          </div>
                        </td>
                        <td>{rank.hoc_sinh.to?.ten_to || `Tổ ${rank.hoc_sinh.to_id || 1}`}</td>
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
