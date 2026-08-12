import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, UserPlus, FileSpreadsheet, Search, Edit, Trash2, 
  X, CheckCircle, ShieldAlert, Sparkles, Save
} from 'lucide-react';

interface Lop {
  lop_id: number;
  ten_lop: string;
}

interface To {
  to_id: number;
  ten_to: string;
}

interface HocSinh {
  hoc_sinh_id: number;
  lop_id: number;
  to_id: number | null;
  ho_ten: string;
  ma_hoc_sinh: string | null;
  email: string | null;
  vai_tro_thi_dua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho' | 'HocSinh';
  to?: To;
  lop?: Lop;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

export default function StudentsPage() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState<Lop[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [students, setStudents] = useState<HocSinh[]>([]);
  const [selectedToId, setSelectedToId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<HocSinh | null>(null);
  const [formData, setFormData] = useState({
    ho_ten: '',
    ma_hoc_sinh: '',
    email: '',
    to_id: '1',
    vai_tro_thi_dua: 'HocSinh' as HocSinh['vai_tro_thi_dua'],
  });

  // Modal Import Hàng Loạt
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');

  const token = localStorage.getItem('sb-access-token');

  // Lấy danh sách lớp học
  useEffect(() => {
    fetchClasses();
  }, []);

  // Khi chọn lớp -> Tải danh sách học sinh
  useEffect(() => {
    if (selectedClassId) {
      fetchStudents(selectedClassId);
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
        if (data.length > 0) {
          // Ưu tiên chọn lớp của học sinh đang đăng nhập
          const userClassId = profile?.hoc_sinh?.lop_id || data[0].lop_id;
          setSelectedClassId(userClassId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async (lopId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/students?lop_id=${lopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal thêm/sửa
  const handleOpenModal = (hs?: HocSinh) => {
    if (hs) {
      setEditingStudent(hs);
      setFormData({
        ho_ten: hs.ho_ten,
        ma_hoc_sinh: hs.ma_hoc_sinh || '',
        email: hs.email || '',
        to_id: hs.to_id ? hs.to_id.toString() : '1',
        vai_tro_thi_dua: hs.vai_tro_thi_dua,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        ho_ten: '',
        ma_hoc_sinh: `HS${Math.floor(100 + Math.random() * 900)}`,
        email: '',
        to_id: '1',
        vai_tro_thi_dua: 'HocSinh',
      });
    }
    setIsModalOpen(true);
  };

  // Lưu học sinh (Thêm hoặc Sửa)
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;

    const payload = {
      lop_id: selectedClassId,
      to_id: parseInt(formData.to_id),
      ho_ten: formData.ho_ten,
      ma_hoc_sinh: formData.ma_hoc_sinh || null,
      email: formData.email || null,
      vai_tro_thi_dua: formData.vai_tro_thi_dua,
    };

    try {
      let res;
      if (editingStudent) {
        res = await fetch(`${BACKEND_URL}/students/${editingStudent.hoc_sinh_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BACKEND_URL}/students`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setMessage({ type: 'success', text: editingStudent ? 'Đã cập nhật học sinh' : 'Đã thêm mới học sinh thành công!' });
        setIsModalOpen(false);
        fetchStudents(selectedClassId);
      } else {
        setMessage({ type: 'error', text: 'Thao tác không thành công. Vui lòng thử lại.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    }
  };

  // Xóa học sinh
  const handleDeleteStudent = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi lớp?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Đã xóa học sinh thành công!' });
        if (selectedClassId) fetchStudents(selectedClassId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Import danh sách hàng loạt từ Text/Excel Copy-Paste
  const handleImportList = async () => {
    if (!selectedClassId || !importText.trim()) return;

    const lines = importText.split('\n').filter((l) => l.trim().length > 0);
    const parsedList = lines.map((line) => {
      // Hỗ trợ phân cách dấu phẩy, dấu chấm phẩy hoặc phím Tab (Excel copy)
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      return {
        ho_ten: parts[0] || 'Học sinh mới',
        ma_hoc_sinh: parts[1] || `HS${Math.floor(100 + Math.random() * 900)}`,
        to_id: parts[2] ? parseInt(parts[2]) : 1,
        email: parts[3] || null,
        vai_tro_thi_dua: 'HocSinh' as const,
      };
    });

    try {
      const res = await fetch(`${BACKEND_URL}/students/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lop_id: selectedClassId,
          hoc_sinh_list: parsedList,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `Đã nhập thành công ${parsedList.length} học sinh vào lớp!` });
        setIsImportModalOpen(false);
        setImportText('');
        fetchStudents(selectedClassId);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Lỗi khi nhập danh sách hàng loạt.' });
    }
  };

  // Lọc học sinh
  const filteredStudents = students.filter((hs) => {
    const matchTo = selectedToId === 'all' || hs.to_id?.toString() === selectedToId;
    const matchSearch =
      hs.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hs.ma_hoc_sinh && hs.ma_hoc_sinh.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchTo && matchSearch;
  });

  const getRoleBadge = (role: HocSinh['vai_tro_thi_dua']) => {
    switch (role) {
      case 'LopTruong':
        return <span className="badge badge-amber">🎓 Lớp Trưởng</span>;
      case 'LopPho':
        return <span className="badge badge-blue">📘 Lớp Phó</span>;
      case 'ToTruong':
        return <span className="badge badge-purple">🚩 Tổ Trưởng</span>;
      case 'ToPho':
        return <span className="badge badge-cyan">🚩 Tổ Phó</span>;
      default:
        return <span className="badge badge-emerald">👦 Học Sinh</span>;
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users style={{ color: '#60a5fa' }} /> Quản Lý Danh Sách Học Sinh
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Cập nhật danh sách học sinh, phân Tổ thi đua và gán chức năng cho Ban cán sự lớp
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button className="btn btn-secondary" onClick={() => setIsImportModalOpen(true)}>
            <FileSpreadsheet size={18} /> Nhập Hàng Loạt (Excel)
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <UserPlus size={18} /> Thêm Học Sinh
          </button>
        </div>
      </div>

      {/* Thông báo Alert */}
      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: message.type === 'success' ? '#34d399' : '#f87171',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
            {message.text}
          </span>
          <button onClick={() => setMessage(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Bộ lọc & Tìm kiếm Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Lớp học</label>
          <select 
            className="input" 
            value={selectedClassId || ''} 
            onChange={(e) => setSelectedClassId(Number(e.target.value))}
          >
            {classes.map((c) => (
              <option key={c.lop_id} value={c.lop_id}>Lớp {c.ten_lop}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Lọc theo Tổ</label>
          <select 
            className="input" 
            value={selectedToId} 
            onChange={(e) => setSelectedToId(e.target.value)}
          >
            <option value="all">Tất cả các Tổ</option>
            <option value="1">Tổ 1</option>
            <option value="2">Tổ 2</option>
            <option value="3">Tổ 3</option>
            <option value="4">Tổ 4</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Tìm kiếm</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Tìm theo tên hoặc mã HS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          </div>
        </div>
      </div>

      {/* Bảng Danh sách Học sinh */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Đang tải danh sách học sinh...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Sparkles size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Chưa có học sinh nào</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Hãy bấm nút "Thêm Học Sinh" hoặc "Nhập Hàng Loạt" để cập nhật danh sách lớp</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <UserPlus size={18} /> Thêm ngay
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>STT</th>
                  <th>Họ và Tên</th>
                  <th>Mã Học Sinh</th>
                  <th>Tổ</th>
                  <th>Vai Trò Thi Đua</th>
                  <th>Email</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((hs, index) => (
                  <tr key={hs.hoc_sinh_id}>
                    <td style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>{index + 1}</td>
                    <td style={{ fontWeight: 600, color: 'white' }}>{hs.ho_ten}</td>
                    <td><code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: '#60a5fa' }}>{hs.ma_hoc_sinh || 'N/A'}</code></td>
                    <td><span className="badge badge-blue">{hs.to?.ten_to || `Tổ ${hs.to_id || 1}`}</span></td>
                    <td>{getRoleBadge(hs.vai_tro_thi_dua)}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{hs.email || '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenModal(hs)}
                          style={{ background: 'rgba(59,130,246,0.15)', border: 'none', color: '#60a5fa', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                          title="Sửa thông tin"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(hs.hoc_sinh_id)}
                          style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                          title="Xóa học sinh"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL THÊM / SỬA HỌC SINH */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '500px', margin: '1rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'white', margin: 0 }}>{editingStudent ? 'Chỉnh Sửa Học Sinh' : 'Thêm Học Sinh Mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStudent}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Họ và Tên *</label>
                <input 
                  type="text" 
                  className="input" 
                  required 
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formData.ho_ten}
                  onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Mã Học Sinh</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="HS001"
                    value={formData.ma_hoc_sinh}
                    onChange={(e) => setFormData({ ...formData, ma_hoc_sinh: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Phân Tổ</label>
                  <select 
                    className="input" 
                    value={formData.to_id}
                    onChange={(e) => setFormData({ ...formData, to_id: e.target.value })}
                  >
                    <option value="1">Tổ 1</option>
                    <option value="2">Tổ 2</option>
                    <option value="3">Tổ 3</option>
                    <option value="4">Tổ 4</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Email</label>
                <input 
                  type="email" 
                  className="input" 
                  placeholder="hocsinh@thiduahs.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Vai Trò Thi Đua</label>
                <select 
                  className="input" 
                  value={formData.vai_tro_thi_dua}
                  onChange={(e) => setFormData({ ...formData, vai_tro_thi_dua: e.target.value as any })}
                >
                  <option value="HocSinh">👦 Học Sinh</option>
                  <option value="LopTruong">🎓 Lớp Trưởng</option>
                  <option value="LopPho">📘 Lớp Phó</option>
                  <option value="ToTruong">🚩 Tổ Trưởng</option>
                  <option value="ToPho">🚩 Tổ Phó</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary"><Save size={18} /> Lưu Thông Tin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IMPORT HÀNG LOẠT */}
      {isImportModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '650px', margin: '1rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileSpreadsheet size={20} style={{ color: '#10b981' }} /> Nhập Danh Sách Học Sinh Hàng Loạt
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Bạn có thể copy danh sách từ file Excel/Word và dán vào ô bên dưới. Mỗi dòng là thông tin 1 học sinh theo định dạng:<br />
              <code style={{ background: 'rgba(255,255,255,0.1)', color: '#60a5fa', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                Họ và Tên, Mã Học Sinh, Số Tổ (1-4), Email (không bắt buộc)
              </code>
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <textarea 
                className="input" 
                rows={8}
                placeholder={`Ví dụ:\nNguyễn Văn An, HS001, 1, an@gmail.com\nTrần Thị Bích, HS002, 1, bich@gmail.com\nLê Hoàng Cường, HS003, 2, cuong@gmail.com`}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.4 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {importText.trim() ? `Đã nhận diện: ${importText.split('\n').filter(l => l.trim()).length} học sinh` : ''}
              </span>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsImportModalOpen(false)}>Hủy</button>
                <button type="button" className="btn btn-primary" onClick={handleImportList} disabled={!importText.trim()}>
                  <Sparkles size={18} /> Tiến Hành Nhập Hàng Loạt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
