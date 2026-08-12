import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, Plus, Search, Edit, Trash2, 
  X, CheckCircle, ShieldAlert, Save, Mail, BookOpen
} from 'lucide-react';

interface Lop {
  lop_id: number;
  ten_lop: string;
  khoi: number;
  gvcn_email: string | null;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Lop[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<Lop | null>(null);
  const [formData, setFormData] = useState({
    ten_lop: '',
    khoi: '10',
    gvcn_email: '',
  });

  const token = localStorage.getItem('sb-access-token');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (lop?: Lop) => {
    if (lop) {
      setEditingClass(lop);
      setFormData({
        ten_lop: lop.ten_lop,
        khoi: lop.khoi.toString(),
        gvcn_email: lop.gvcn_email || '',
      });
    } else {
      setEditingClass(null);
      setFormData({
        ten_lop: '',
        khoi: '10',
        gvcn_email: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ten_lop: formData.ten_lop,
      khoi: parseInt(formData.khoi),
      gvcn_email: formData.gvcn_email || null,
      nien_hoc_id: 1, // Mặc định niên học hiện tại
    };

    try {
      let res;
      if (editingClass) {
        res = await fetch(`${BACKEND_URL}/classes/${editingClass.lop_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BACKEND_URL}/classes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setMessage({ 
          type: 'success', 
          text: editingClass ? 'Đã cập nhật thông tin lớp học!' : 'Đã thêm mới lớp học thành công!' 
        });
        setIsModalOpen(false);
        fetchClasses();
      } else {
        setMessage({ type: 'error', text: 'Có lỗi xảy ra, vui lòng thử lại.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    }
  };

  const handleDeleteClass = async (id: number) => {
    if (!window.confirm('CẢNH BÁO: Xóa lớp học sẽ xóa toàn bộ Tổ và Học sinh thuộc lớp này. Bạn có chắc chắn muốn xóa?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/classes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Đã xóa lớp học thành công!' });
        fetchClasses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredClasses = classes.filter((c) =>
    c.ten_lop.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.gvcn_email && c.gvcn_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container fade-in" style={{ padding: '1.5rem 0.8rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <GraduationCap style={{ color: 'var(--color-primary)' }} /> Quản Lý Lớp Học
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Khai báo lớp học, khối học và gán Giáo viên chủ nhiệm (GVCN) quản lý lớp
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Thêm Lớp Mới
        </button>
      </div>

      {/* Alert */}
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

      {/* Toolbar */}
      <div className="card" style={{ marginBottom: '1.2rem', padding: '1rem' }}>
        <div className="form-group" style={{ maxWidth: '400px' }}>
          <label className="form-label">Tìm kiếm lớp</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Tên lớp hoặc email GVCN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>

      {/* Classes Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Đang tải danh sách lớp học...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Không tìm thấy lớp học nào. Bấm nút Thêm Lớp Mới để bắt đầu.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center' }}>ID Lớp</th>
                  <th>Tên Lớp</th>
                  <th>Khối</th>
                  <th>Giáo Viên Chủ Nhiệm (Email)</th>
                  <th>Số Lượng Tổ</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((lop) => (
                  <tr key={lop.lop_id}>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>{lop.lop_id}</td>
                    <td style={{ fontWeight: 700, color: 'white', fontSize: '1.05rem' }}>Lớp {lop.ten_lop}</td>
                    <td><span className="badge badge-primary">Khối {lop.khoi}</span></td>
                    <td style={{ color: 'white', fontWeight: 500 }}>{lop.gvcn_email || <em style={{ color: 'var(--text-muted)' }}>Chưa gán</em>}</td>
                    <td><span className="badge badge-muted">4 Tổ mặc định</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenModal(lop)}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '0.4rem', color: 'var(--color-primary)' }}
                          title="Sửa lớp"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClass(lop.lop_id)}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '0.4rem', color: 'var(--color-danger)' }}
                          title="Xóa lớp"
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

      {/* MODAL THÊM / SỬA LỚP */}
      {isModalOpen && (
        <div className="mobile-modal-overlay">
          <div className="card fade-in mobile-modal-content" style={{ 
            width: '100%', maxWidth: '480px', 
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
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', fontWeight: 800, margin: 0,
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>
                    {editingClass ? 'Cập Nhật Lớp Học' : 'Tạo Lớp Học Mới'}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    {editingClass ? 'Chỉnh sửa thông tin lớp và GVCN' : 'Tạo lớp học mới và tự khởi tạo hệ thống 4 tổ'}
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

            {/* Form */}
            <form onSubmit={handleSaveClass}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={15} style={{ color: 'var(--color-primary)' }} /> Tên Lớp Học *
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="Ví dụ: 10A1, 11A2..."
                  value={formData.ten_lop}
                  onChange={(e) => setFormData({ ...formData, ten_lop: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Khối Học *
                </label>
                <select 
                  className="form-select" 
                  value={formData.khoi}
                  onChange={(e) => setFormData({ ...formData, khoi: e.target.value })}
                >
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={15} style={{ color: 'var(--color-primary)' }} /> Email Giáo Viên Chủ Nhiệm (GVCN)
                </label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="gvcn10a1@thiduahs.com"
                  value={formData.gvcn_email}
                  onChange={(e) => setFormData({ ...formData, gvcn_email: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}><Save size={18} /> Lưu Lớp</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
