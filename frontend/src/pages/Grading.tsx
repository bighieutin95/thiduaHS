import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search, Calendar, FileText, XCircle } from 'lucide-react';

interface HocSinh {
  hoc_sinh_id: number;
  ho_ten: string;
  ma_hoc_sinh: string;
  to_id: number;
  ten_to: string;
}

interface TieuChi {
  tieu_chi_id: number;
  ten_tieu_chi: string;
  nhom_tieu_chi: string;
  loai: 'Cong' | 'Tru';
  so_diem: string;
}

interface LichSu {
  lich_su_id: string;
  hoc_sinh: { ho_ten: string };
  tieu_chi: { ten_tieu_chi: string; loai: 'Cong' | 'Tru' };
  so_diem_thuc_te: string;
  ngay_vi_pham: string;
  mo_ta: string;
  trang_thai: 'HieuLuc' | 'BiHuy';
}

export default function Grading() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<HocSinh[]>([]);
  const [criteria, setCriteria] = useState<TieuChi[]>([]);
  const [history, setHistory] = useState<LichSu[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [selectedStudent, setSelectedStudent] = useState<number | ''>('');
  const [selectedCriteria, setSelectedCriteria] = useState<number | ''>('');
  const [ngayViPham, setNgayViPham] = useState(new Date().toISOString().split('T')[0]);
  const [moTa, setMoTa] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';
  const token = localStorage.getItem('sb-access-token');

  // Load danh sách học sinh
  const loadStudents = useCallback(async () => {
    if (!profile?.hoc_sinh) return;
    try {
      const res = await fetch(`${BACKEND_URL}/classes/${profile.hoc_sinh.lop_id}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Lọc danh sách: Nếu là Tổ trưởng/Tổ phó, chỉ hiển thị thành viên trong tổ của mình
        const vaiTro = profile.hoc_sinh.vai_tro_thi_dua;
        if ((vaiTro === 'ToTruong' || vaiTro === 'ToPho') && profile.hoc_sinh.to_id) {
          const toId = profile.hoc_sinh.to_id;
          setStudents(data.filter((hs: any) => hs.to_id === toId));
        } else {
          setStudents(data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [profile, token, BACKEND_URL]);

  // Load tiêu chí thi đua
  const loadCriteria = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/criteria`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCriteria(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token, BACKEND_URL]);

  // Load lịch sử chấm gần đây
  const loadHistory = useCallback(async () => {
    try {
      let url = `${BACKEND_URL}/emulation/history`;
      if (profile?.hoc_sinh) {
        url += `?lop_id=${profile.hoc_sinh.lop_id}`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.slice(0, 10)); // Lấy 10 dòng gần nhất
      }
    } catch (err) {
      console.error(err);
    }
  }, [profile, token, BACKEND_URL]);

  useEffect(() => {
    loadStudents();
    loadCriteria();
    loadHistory();
  }, [loadStudents, loadCriteria, loadHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCriteria) {
      setMessage({ type: 'error', text: 'Vui lòng chọn đầy đủ học sinh và tiêu chí.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`${BACKEND_URL}/emulation/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hoc_sinh_id: Number(selectedStudent),
          tieu_chi_id: Number(selectedCriteria),
          ngay_vi_pham: ngayViPham,
          mo_ta: moTa,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Ghi nhận điểm thi đua thành công!' });
        setSelectedStudent('');
        setSelectedCriteria('');
        setMoTa('');
        loadHistory(); // Reload history
      } else {
        setMessage({ type: 'error', text: data.message || 'Lỗi khi ghi nhận điểm thi đua.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Kết nối máy chủ thất bại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelDiem = async (lichSuId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đầu điểm chấm thi đua này không?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/emulation/history/${lichSuId}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert('Đã hủy điểm thi đua thành công.');
        loadHistory();
      } else {
        alert(data.message || 'Lỗi không thể hủy điểm.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Lọc học sinh theo ô tìm kiếm
  const filteredStudents = students.filter((s) =>
    s.ho_ten.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <h2>Chấm Điểm Thi Đua Lớp</h2>
          <p>Ghi nhận lỗi vi phạm (trừ điểm) hoặc thành tích (cộng điểm) cho học sinh</p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Form chấm điểm */}
        <div className="glass-card" style={{ padding: 'var(--spacing-6)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--spacing-5)' }}>
            Phiếu Ghi Nhận Thi Đua
          </h3>

          {message && (
            <div
              style={{
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--border-radius-md)',
                marginBottom: 'var(--spacing-5)',
                background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: message.type === 'success' ? '#059669' : '#dc2626',
                border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
                fontSize: 'var(--font-size-sm)',
              }}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {/* Chọn học sinh */}
            <div className="form-group">
              <label className="form-label">1. Tìm & Chọn học sinh</label>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Nhập tên học sinh để tìm nhanh..."
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value ? Number(e.target.value) : '')}
                required
              >
                <option value="">-- Chọn học sinh từ danh sách --</option>
                {filteredStudents.map((s) => (
                  <option key={s.hoc_sinh_id} value={s.hoc_sinh_id}>
                    {s.ho_ten} ({s.ten_to || `Tổ ${s.to_id}`})
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn tiêu chí */}
            <div className="form-group">
              <label className="form-label">2. Chọn tiêu chí chấm điểm</label>
              <select
                className="form-select"
                value={selectedCriteria}
                onChange={(e) => setSelectedCriteria(e.target.value ? Number(e.target.value) : '')}
                required
              >
                <option value="">-- Chọn tiêu chí thi đua --</option>
                <optgroup label="CỘNG ĐIỂM (Thành tích)">
                  {criteria
                    .filter((c) => c.loai === 'Cong')
                    .map((c) => (
                      <option key={c.tieu_chi_id} value={c.tieu_chi_id}>
                        [+{Number(c.so_diem)}đ] {c.ten_tieu_chi} ({c.nhom_tieu_chi})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="TRỪ ĐIỂM (Lỗi vi phạm)">
                  {criteria
                    .filter((c) => c.loai === 'Tru')
                    .map((c) => (
                      <option key={c.tieu_chi_id} value={c.tieu_chi_id}>
                        [-{Number(c.so_diem)}đ] {c.ten_tieu_chi} ({c.nhom_tieu_chi})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Ngày ghi nhận */}
            <div className="form-group">
              <label className="form-label">3. Ngày xảy ra vi phạm/thành tích</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="date"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={ngayViPham}
                  onChange={(e) => setNgayViPham(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Mô tả chi tiết */}
            <div className="form-group">
              <label className="form-label">4. Mô tả chi tiết (Tùy chọn)</label>
              <div style={{ position: 'relative' }}>
                <FileText size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                <textarea
                  className="form-textarea"
                  style={{ paddingLeft: '40px', minHeight: '80px' }}
                  placeholder="Ghi chú chi tiết thêm..."
                  value={moTa}
                  onChange={(e) => setMoTa(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : <><Plus size={18} /> Ghi nhận thi đua</>}
            </button>
          </form>
        </div>

        {/* Lịch sử tự chấm của lớp */}
        <div className="glass-card" style={{ padding: 'var(--spacing-6)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--spacing-5)' }}>
            Lịch Sử Chấm Của Lớp Trong Tuần
          </h3>

          <div className="table-wrapper" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Học sinh</th>
                  <th>Tiêu chí</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.lich_su_id} style={{ opacity: item.trang_thai === 'BiHuy' ? 0.45 : 1 }}>
                    <td style={{ fontWeight: 600 }}>{item.hoc_sinh.ho_ten}</td>
                    <td>
                      <span className={`badge ${item.tieu_chi.loai === 'Cong' ? 'badge-success' : 'badge-danger'}`}>
                        {item.tieu_chi.ten_tieu_chi} ({item.tieu_chi.loai === 'Cong' ? '+' : '-'}{Number(item.so_diem_thuc_te)}đ)
                      </span>
                    </td>
                    <td>{new Date(item.ngay_vi_pham).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className={`badge ${item.trang_thai === 'HieuLuc' ? 'badge-primary' : 'badge-muted'}`}>
                        {item.trang_thai === 'HieuLuc' ? 'Có hiệu lực' : 'Đã hủy'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {item.trang_thai === 'HieuLuc' && (
                        <button
                          onClick={() => handleCancelDiem(item.lich_su_id)}
                          className="btn btn-sm btn-secondary"
                          style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                          title="Hủy đầu điểm chấm sai"
                        >
                          <XCircle size={14} /> Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>
                      Chưa chấm điểm nào cho lớp trong tuần này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
