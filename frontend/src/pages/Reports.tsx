import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Medal, ShieldAlert } from 'lucide-react';

interface WeeklyReport {
  tong_hop_tuan_id: number;
  diem_cuoi_cung: string;
  tong_diem_cong: string;
  tong_diem_tru: string;
  tuan_thu: number;
  hoc_sinh: {
    hoc_sinh_id: number;
    ho_ten: string;
    ma_hoc_sinh: string;
    ten_to: string;
  };
}

interface MonthlyReport {
  tong_hop_thang_id: number;
  diem_trung_binh: string;
  xep_loai: string;
  hoc_sinh: {
    ho_ten: string;
    ma_hoc_sinh: string;
    ten_to: string;
  };
}

export default function Reports() {
  const { profile } = useAuth();
  
  const getTuanThu = (date: Date): number => {
    const baseDate = new Date(2026, 8, 5); // 05/09/2026
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    const diffTime = d1.getTime() - d2.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return 1 + Math.floor(diffDays / 7);
  };

  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week');
  const [selectedWeek, setSelectedWeek] = useState(getTuanThu(new Date())); // Tuần mặc định động
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [weeklyData, setWeeklyData] = useState<WeeklyReport[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRealtime, setIsRealtime] = useState(true); // Mặc định xem điểm tạm tính thời gian thực

  // State Modal xem chi tiết vi phạm
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    studentId: number;
    studentName: string;
    records: any[];
  }>({
    isOpen: false,
    studentId: 0,
    studentName: '',
    records: []
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';
  const token = localStorage.getItem('sb-access-token');

  // Lấy danh sách tuần từ -2 đến 52
  const getWeeks = () => Array.from({ length: 55 }, (_, i) => i - 2);
  const getMonths = () => Array.from({ length: 12 }, (_, i) => i + 1);

  const loadWeeklyReport = useCallback(async () => {
    if (!profile) return;
    const lopId = profile.hoc_sinh?.lop_id || profile.gvcn_lop?.lop_id || 4; // Mặc định lớp 11C2 (ID: 4)
    setIsLoading(true);
    try {
      const endpoint = isRealtime ? 'realtime-weekly' : 'weekly';
      const res = await fetch(
        `${BACKEND_URL}/emulation/reports/${endpoint}?lop_id=${lopId}&tuan_thu=${selectedWeek}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        if (isRealtime) {
          // Map cấu hình điểm tạm tính sang interface WeeklyReport
          const mappedData = data.map((item: any, index: number) => ({
            tong_hop_tuan_id: item.hoc_sinh.hoc_sinh_id + index,
            diem_cuoi_cung: String(item.diem_cuoi_cung),
            tong_diem_cong: String(item.tong_diem_cong),
            tong_diem_tru: String(item.tong_diem_tru),
            tuan_thu: item.tuan_thu,
            hoc_sinh: {
              hoc_sinh_id: item.hoc_sinh.hoc_sinh_id,
              ho_ten: item.hoc_sinh.ho_ten,
              ma_hoc_sinh: item.hoc_sinh.ma_hoc_sinh,
              ten_to: item.hoc_sinh.ten_to || `Tổ ${item.hoc_sinh.to_id || 1}`
            }
          }));
          setWeeklyData(mappedData);
        } else {
          setWeeklyData(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [profile, selectedWeek, isRealtime, token, BACKEND_URL]);

  const loadMonthlyReport = useCallback(async () => {
    if (!profile) return;
    const lopId = profile.hoc_sinh?.lop_id || profile.gvcn_lop?.lop_id || 4;
    setIsLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/emulation/reports/monthly?lop_id=${lopId}&thang=${selectedMonth}&nam=${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setMonthlyData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [profile, selectedMonth, selectedYear, token, BACKEND_URL]);

  useEffect(() => {
    if (activeTab === 'week') {
      loadWeeklyReport();
    } else {
      loadMonthlyReport();
    }
  }, [activeTab, loadWeeklyReport, loadMonthlyReport]);

  const openDetailModal = async (studentId: number, studentName: string) => {
    setDetailModal({ isOpen: true, studentId, studentName, records: [] });
    try {
      const res = await fetch(`${BACKEND_URL}/emulation/history?hoc_sinh_id=${studentId}&tuan_thu=${selectedWeek}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Lọc bản ghi hợp lệ
        setDetailModal(prev => ({ ...prev, records: data.filter((d: any) => d.trang_thai === 'HieuLuc') }));
      }
    } catch (err) {
      console.error('Lỗi khi tải chi tiết vi phạm:', err);
    }
  };

  const getPodiumStudents = () => {
    if (activeTab === 'week') {
      return [...weeklyData].sort((a, b) => Number(b.diem_cuoi_cung) - Number(a.diem_cuoi_cung)).slice(0, 3);
    } else {
      return [...monthlyData].sort((a, b) => Number(b.diem_trung_binh) - Number(a.diem_trung_binh)).slice(0, 3);
    }
  };

  const podium = getPodiumStudents();

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <h2>Báo Cáo Thi Đua Tổng Hợp</h2>
          <p>Xem danh sách xếp hạng điểm thi đua tuần và tổng kết tháng của lớp</p>
        </div>

        {/* Cấu hình bộ lọc */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Nút toggle realtime/chốt */}
          {activeTab === 'week' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'white', background: 'rgba(255,255,255,0.06)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <input
                type="checkbox"
                checked={isRealtime}
                onChange={(e) => setIsRealtime(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
              Xem điểm tạm tính (Thời gian thực)
            </label>
          )}

          {activeTab === 'week' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
              <select
                className="form-select"
                style={{ width: '130px', padding: '8px 12px' }}
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
              >
                {getWeeks().map((w) => (
                  <option key={w} value={w}>
                    Tuần {w}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                className="form-select"
                style={{ width: '110px', padding: '8px 12px' }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {getMonths().map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>
              <select
                className="form-select"
                style={{ width: '100px', padding: '8px 12px' }}
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('week')}
          style={{
            background: 'none',
            border: 'none',
            padding: '12px 24px',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 700,
            color: activeTab === 'week' ? 'var(--color-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'week' ? '3px solid var(--color-primary)' : '3px solid transparent',
            cursor: 'pointer',
          }}
        >
          Tổng hợp theo tuần
        </button>
        <button
          onClick={() => setActiveTab('month')}
          style={{
            background: 'none',
            border: 'none',
            padding: '12px 24px',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 700,
            color: activeTab === 'month' ? 'var(--color-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'month' ? '3px solid var(--color-primary)' : '3px solid transparent',
            cursor: 'pointer',
          }}
        >
          Tổng hợp cuối tháng
        </button>
      </div>

      {/* Podium Vinh Danh Top 3 */}
      {podium.length > 0 && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: '20px', color: 'var(--text-secondary)' }}>
            👑 Vinh Danh Top Học Sinh Xuất Sắc Nhất Lớp
          </h3>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-end', justifyContent: 'center', minHeight: '180px', flexWrap: 'wrap' }}>
            {/* Hạng 2 */}
            {podium[1] && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Medal size={36} style={{ color: '#94a3b8' }} />
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, marginTop: '8px' }}>{podium[1].hoc_sinh.ho_ten}</span>
                <span className="badge badge-muted" style={{ marginTop: '4px' }}>
                  {activeTab === 'week' ? `${(podium[1] as any).diem_cuoi_cung}đ` : `${(podium[1] as any).diem_trung_binh}đ`}
                </span>
                <div style={{ width: '100px', height: '80px', background: 'linear-gradient(180deg, #cbd5e1, #94a3b8)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#1e293b', fontWeight: 800 }}>
                  2
                </div>
              </div>
            )}

            {/* Hạng 1 */}
            {podium[0] && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Medal size={48} style={{ color: '#eab308', filter: 'drop-shadow(0 0 10px rgba(234,179,8,0.4))' }} />
                <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, marginTop: '8px' }}>{podium[0].hoc_sinh.ho_ten}</span>
                <span className="badge badge-success" style={{ marginTop: '4px' }}>
                  {activeTab === 'week' ? `${(podium[0] as any).diem_cuoi_cung}đ` : `${(podium[0] as any).diem_trung_binh}đ`}
                </span>
                <div style={{ width: '120px', height: '110px', background: 'linear-gradient(180deg, #fef08a, #eab308)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#1e293b', fontWeight: 800, fontSize: '1.25rem' }}>
                  1
                </div>
              </div>
            )}

            {/* Hạng 3 */}
            {podium[2] && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Medal size={32} style={{ color: '#b45309' }} />
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, marginTop: '8px' }}>{podium[2].hoc_sinh.ho_ten}</span>
                <span className="badge badge-muted" style={{ marginTop: '4px' }}>
                  {activeTab === 'week' ? `${(podium[2] as any).diem_cuoi_cung}đ` : `${(podium[2] as any).diem_trung_binh}đ`}
                </span>
                <div style={{ width: '100px', height: '60px', background: 'linear-gradient(180deg, #fed7aa, #b45309)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#1e293b', fontWeight: 800 }}>
                  3
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Report Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        ) : activeTab === 'week' ? (
          /* Bảng tổng hợp tuần */
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Hạng</th>
                  <th>Học sinh (Click dòng để xem chi tiết)</th>
                  <th>Tổ</th>
                  <th>Điểm khởi đầu</th>
                  <th>Tổng cộng (+)</th>
                  <th>Tổng trừ (-)</th>
                  <th style={{ textAlign: 'right' }}>Điểm tuần</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.map((item, index) => (
                  <tr 
                    key={item.tong_hop_tuan_id}
                    onClick={() => openDetailModal(item.hoc_sinh.hoc_sinh_id, item.hoc_sinh.ho_ten)}
                    style={{ cursor: 'pointer' }}
                    title="Click để xem chi tiết vi phạm/thành tích của học sinh này"
                  >
                    <td style={{ fontWeight: 700 }}>#{index + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{item.hoc_sinh.ho_ten} 🔍</td>
                    <td>{item.hoc_sinh.ten_to || 'Chưa chia'}</td>
                    <td>100.00đ</td>
                    <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>+{Number(item.tong_diem_cong)}đ</td>
                    <td style={{ color: 'var(--color-danger)', fontWeight: 600 }}>-{Number(item.tong_diem_tru)}đ</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {Number(item.diem_cuoi_cung)}đ
                    </td>
                  </tr>
                ))}
                {weeklyData.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                      <ShieldAlert size={28} style={{ opacity: 0.3, marginBottom: '8px' }} />
                      <p>Không có dữ liệu điểm của tuần này. Điểm tuần được chốt vào 22h00 tối thứ Sáu.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Bảng tổng kết tháng & xếp loại */
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Hạng</th>
                  <th>Học sinh</th>
                  <th>Tổ</th>
                  <th>Điểm trung bình tháng</th>
                  <th style={{ textAlign: 'right' }}>Xếp loại thi đua</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, index) => (
                  <tr key={item.tong_hop_thang_id}>
                    <td style={{ fontWeight: 700 }}>#{index + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.hoc_sinh.ho_ten}</td>
                    <td>{item.hoc_sinh.ten_to || 'Chưa chia'}</td>
                    <td style={{ fontWeight: 700 }}>{Number(item.diem_trung_binh)}đ</td>
                    <td style={{ textAlign: 'right' }}>
                      <span
                        className={`badge ${
                          item.xep_loai === 'Xuất sắc'
                            ? 'badge-success'
                            : item.xep_loai === 'Tốt'
                            ? 'badge-primary'
                            : item.xep_loai === 'Khá'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {item.xep_loai}
                      </span>
                    </td>
                  </tr>
                ))}
                {monthlyData.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>
                      <ShieldAlert size={28} style={{ opacity: 0.3, marginBottom: '8px' }} />
                      <p>Không có dữ liệu tổng kết thi đua tháng này.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal chi tiết vi phạm */}
      {detailModal.isOpen && (
        <div className="mobile-modal-overlay" style={{ zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '650px', background: '#1e293b', color: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔍 Chi Tiết Thi Đua: {detailModal.studentName} (Tuần {selectedWeek})
              </h3>
              <button onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false }))} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.4rem' }}>✕</button>
            </div>
            
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {detailModal.records.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <ShieldAlert size={36} style={{ opacity: 0.3, marginBottom: '10px' }} />
                  <p>Không có ghi nhận vi phạm hay thành tích nào trong tuần này.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table" style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Tiêu chí</th>
                        <th>Điểm</th>
                        <th>Ngày xảy ra</th>
                        <th>Ghi chú / Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailModal.records.map((rec: any) => (
                        <tr key={rec.lich_su_id}>
                          <td>
                            <span className={`badge ${rec.tieu_chi.loai === 'Cong' ? 'badge-success' : 'badge-danger'}`}>
                              {rec.tieu_chi.ten_tieu_chi}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: rec.tieu_chi.loai === 'Cong' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {rec.tieu_chi.loai === 'Cong' ? '+' : '-'}{Number(rec.so_diem_thuc_te)}đ
                          </td>
                          <td>{new Date(rec.ngay_vi_pham).toLocaleDateString('vi-VN')}</td>
                          <td>{rec.mo_ta || 'Không có'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false }))}
                style={{ minHeight: '38px', padding: '0 20px' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
