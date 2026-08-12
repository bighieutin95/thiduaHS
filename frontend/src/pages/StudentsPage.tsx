import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, UserPlus, FileSpreadsheet, Search, Edit, Trash2, 
  X, CheckCircle, ShieldAlert, Sparkles, Save, User, IdCard, Mail, Award, AlertCircle
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
          const userClassId = profile?.gvcn_lop?.lop_id || profile?.hoc_sinh?.lop_id || data[0].lop_id;
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
        setMessage({ type: 'success', text: editingStudent ? 'Đã cập nhật thông tin học sinh!' : 'Đã thêm mới học sinh thành công!' });
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
    if (!window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi danh sách lớp?')) return;
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
    <div className="container fade-in" style={{ padding: '1.5rem 0.8rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users style={{ color: 'var(--color-primary)' }} /> Quản Lý Danh Sách Học Sinh
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Cập nhật danh sách học sinh, phân Tổ thi đua và gán chức năng cho Ban cán sự lớp
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', width: '100%', maxWidth: '350px' }}>
          <button className="btn btn-secondary" onClick={() => setIsImportModalOpen(true)} style={{ flex: 1, justifyContent: 'center' }}>
            <FileSpreadsheet size={18} /> Excel Import
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ flex: 1, justifyContent: 'center' }}>
            <UserPlus size={18} /> Thêm Mới
          </button>
        </div>
      </div>

      {/* Thông báo Alert */}
      {message && (
        <div style={{
          padding: '0.8rem 1rem',
          borderRadius: 'var(--border-radius-md)',
          marginBottom: '1.2rem',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: message.type === 'success' ? '#34d399' : '#f87171',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
            {message.text}
          </span>
          <button onClick={() => setMessage(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Bộ lọc & Tìm kiếm Toolbar */}
      <div className="card" style={{ marginBottom: '1.2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.8rem', alignItems: 'center', padding: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Lớp học</label>
          <select 
            className="form-select" 
            value={selectedClassId || ''} 
            onChange={(e) => setSelectedClassId(Number(e.target.value))}
            disabled={profile?.vai_tro_he_thong !== 'Admin'}
          >
            {classes.map((c) => (
              <option key={c.lop_id} value={c.lop_id}>Lớp {c.ten_lop}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Lọc theo Tổ</label>
          <select 
            className="form-select" 
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

        <div className="form-group">
          <label className="form-label">Tìm kiếm</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Tên hoặc mã HS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>

      {/* Bảng Danh sách Học sinh (Desktop View) */}
      <div className="card desktop-table-view" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Đang tải danh sách học sinh...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Sparkles size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Chưa có học sinh nào trong lớp</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Hãy bấm nút "Thêm Mới" hoặc "Excel Import" để cập nhật danh sách học sinh</p>
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
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{index + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{hs.ho_ten}</td>
                    <td><code style={{ background: 'var(--bg-muted)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--color-primary)', fontWeight: 600 }}>{hs.ma_hoc_sinh || 'N/A'}</code></td>
                    <td><span className="badge badge-primary">{hs.to?.ten_to || `Tổ ${hs.to_id || 1}`}</span></td>
                    <td>{getRoleBadge(hs.vai_tro_thi_dua)}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{hs.email || '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenModal(hs)}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '0.4rem', color: 'var(--color-primary)' }}
                          title="Sửa thông tin"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(hs.hoc_sinh_id)}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '0.4rem', color: 'var(--color-danger)' }}
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

      {/* MOBILE CARDS VIEW (Chỉ hiển thị trên Điện Thoại) */}
      <div className="mobile-student-grid">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="spinner"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chưa có học sinh nào trong lớp. Bấm nút Thêm Mới để bắt đầu.
          </div>
        ) : (
          filteredStudents.map((hs, idx) => (
            <div key={hs.hoc_sinh_id} className="mobile-student-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.95rem'
                }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{hs.ho_ten}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{hs.to?.ten_to || `Tổ ${hs.to_id || 1}`}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hs.ma_hoc_sinh || ''}</span>
                  </div>
                  <div style={{ marginTop: '0.3rem' }}>{getRoleBadge(hs.vai_tro_thi_dua)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleOpenModal(hs)}
                  style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.2)', border: 'none',
                    color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteStudent(hs.hoc_sinh_id)}
                  style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.2)', border: 'none',
                    color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL THÊM / SỬA HỌC SINH (MOBILE BOTTOM SHEET & DESKTOP CENTERED) */}
      {isModalOpen && (
        <div className="mobile-modal-overlay">
          <div className="card fade-in mobile-modal-content" style={{ 
            width: '100%', maxWidth: '520px', 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            padding: '1.5rem'
          }}>
            {/* Header Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ 
                  width: '42px', height: '42px', borderRadius: '12px', 
                  background: 'rgba(var(--color-primary-rgb), 0.12)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-primary)'
                }}>
                  {editingStudent ? <Edit size={22} /> : <UserPlus size={22} />}
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', fontWeight: 800, margin: 0,
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>
                    {editingStudent ? 'Chỉnh Sửa Học Sinh' : 'Thêm Học Sinh Mới'}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    {editingStudent ? 'Cập nhật thông tin cá nhân và vai trò thi đua' : 'Nhập thông tin cá nhân của học sinh vào lớp học'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ 
                  background: 'var(--bg-muted)', border: 'none', 
                  color: 'var(--text-muted)', cursor: 'pointer',
                  width: '32px', height: '32px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Input */}
            <form onSubmit={handleSaveStudent}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} style={{ color: 'var(--color-primary)' }} /> Họ và Tên *
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formData.ho_ten}
                  onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <IdCard size={15} style={{ color: 'var(--color-primary)' }} /> Mã Học Sinh
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="HS001"
                    value={formData.ma_hoc_sinh}
                    onChange={(e) => setFormData({ ...formData, ma_hoc_sinh: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={15} style={{ color: 'var(--color-primary)' }} /> Phân Tổ
                  </label>
                  <select 
                    className="form-select" 
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

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={15} style={{ color: 'var(--color-primary)' }} /> Email kết nối
                </label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="hocsinh@thiduahs.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={15} style={{ color: 'var(--color-primary)' }} /> Vai Trò Thi Đua
                </label>
                <select 
                  className="form-select" 
                  value={formData.vai_tro_thi_dua}
                  onChange={(e) => setFormData({ ...formData, vai_tro_thi_dua: e.target.value as any })}
                >
                  <option value="HocSinh">👦 Học Sinh (Thành viên)</option>
                  <option value="LopTruong">🎓 Lớp Trưởng (Quyền chấm & duyệt)</option>
                  <option value="LopPho">📘 Lớp Phó (Ban cán sự lớp)</option>
                  <option value="ToTruong">🚩 Tổ Trưởng (Quản lý tổ)</option>
                  <option value="ToPho">🚩 Tổ Phó (Phó tổ)</option>
                </select>
              </div>

              {/* Footer Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}><Save size={18} /> {editingStudent ? 'Cập Nhật' : 'Tạo Mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IMPORT HÀNG LOẠT */}
      {isImportModalOpen && (
        <div className="mobile-modal-overlay">
          <div className="card fade-in mobile-modal-content" style={{ 
            width: '100%', maxWidth: '680px', 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ 
                  width: '42px', height: '42px', borderRadius: '12px', 
                  background: 'rgba(16, 185, 129, 0.12)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#10b981'
                }}>
                  <FileSpreadsheet size={22} />
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', fontWeight: 800, margin: 0,
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>
                    Nhập Danh Sách Học Sinh Hàng Loạt
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    Nhập nhiều học sinh từ file Excel hoặc văn bản dán trực tiếp
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsImportModalOpen(false)} 
                style={{ 
                  background: 'var(--bg-muted)', border: 'none', 
                  color: 'var(--text-muted)', cursor: 'pointer',
                  width: '32px', height: '32px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ 
              background: 'rgba(var(--color-primary-rgb), 0.08)', 
              border: '1px dashed var(--color-primary)', 
              borderRadius: 'var(--border-radius-md)', 
              padding: '0.8rem 1rem', 
              marginBottom: '1rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
              fontSize: '0.82rem', color: 'var(--text-secondary)'
            }}>
              <AlertCircle size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Mẫu nhập:</strong> Copy các dòng từ Excel hoặc dán văn bản theo cấu trúc:<br />
                <code style={{ background: 'var(--bg-muted)', padding: '0.1rem 0.4rem', borderRadius: '4px', color: 'var(--color-primary)', fontWeight: 600 }}>
                  Họ và Tên, Mã Học Sinh, Số Tổ (1-4), Email
                </code>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <textarea 
                className="form-textarea" 
                rows={6}
                placeholder={`Dán danh sách vào đây. Ví dụ:\nNguyễn Văn An, HS001, 1, an@gmail.com\nTrần Thị Bích, HS002, 1, bich@gmail.com`}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.4 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', gap: '0.8rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {importText.trim() ? `✨ Đã nhận diện: ${importText.split('\n').filter(l => l.trim()).length} dòng` : ''}
              </span>
              <div style={{ display: 'flex', gap: '0.6rem', width: '100%', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsImportModalOpen(false)}>Hủy bỏ</button>
                <button type="button" className="btn btn-success" onClick={handleImportList} disabled={!importText.trim()}>
                  <Sparkles size={18} /> Nhập Hàng Loạt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
