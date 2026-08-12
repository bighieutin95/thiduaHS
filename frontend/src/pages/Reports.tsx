import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Award, Calendar, FileSpreadsheet, Medal, ShieldAlert } from 'lucide-react';

interface WeeklyReport {
  tong_hop_tuan_id: number;
  diem_cuoi_cung: string;
  tong_diem_cong: string;
  tong_diem_tru: string;
  tuan_thu: number;
  hoc_sinh: {
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
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week');
  const [selectedWeek, setSelectedWeek] = useState(33); // Tuần mặc định hiện tại
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [weeklyData, setWeeklyData] = useState<WeeklyReport[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';
  const token = localStorage.getItem('sb-access-token');

  // Lấy danh sách tuần hiện tại
  const getWeeks = () => Array.from({ length: 52 }, (_, i) => i + 1);
  const getMonths = () => Array.from({ length: 12 }, (_, i) => i + 1);

  const loadWeeklyReport = useCallback(async () => {
    if (!profile?.hoc_sinh) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/emulation/reports/weekly?lop_id=${profile.hoc_sinh.lop_id}&tuan_thu=${selectedWeek}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setWeeklyData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [profile, selectedWeek, token, BACKEND_URL]);

  const loadMonthlyReport = useCallback(async () => {
    if (!profile?.hoc_sinh) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/emulation/reports/monthly?lop_id=${profile.hoc_sinh.lop_id}&thang=${selectedMonth}&nam=${selectedYear}`,
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
        <div style={{ display: 'flex', gap: '12px' }}>
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
                  <th>Học sinh</th>
                  <th>Tổ</th>
                  <th>Điểm khởi đầu</th>
                  <th>Tổng cộng (+)</th>
                  <th>Tổng trừ (-)</th>
                  <th style={{ textAlign: 'right' }}>Điểm tuần</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.map((item, index) => (
                  <tr key={item.tong_hop_tuan_id}>
                    <td style={{ fontWeight: 700 }}>#{index + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.hoc_sinh.ho_ten}</td>
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
                      <p>Không có dữ liệu điểm chốt của tuần này. Điểm tuần được chốt vào 22h00 tối thứ Sáu.</p>
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
    </div>
  );
}
