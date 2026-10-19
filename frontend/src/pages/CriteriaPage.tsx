import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Award, Plus, Search, Edit2, Trash2, Save, AlertCircle, ShieldAlert, CheckCircle 
} from 'lucide-react';

interface TieuChi {
  tieu_chi_id: number;
  ten_tieu_chi: string;
  nhom_tieu_chi: string;
  loai: 'Cong' | 'Tru';
  so_diem: string;
  trang_thai: boolean;
}

import { BACKEND_URL } from '../config';
import { DEFAULT_CRITERIA, getStoredData, setStoredData } from '../lib/mockData';

export default function CriteriaPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.vai_tro_he_thong === 'Admin';
  const isGvcn = !!profile?.gvcn_lop;

  if (!isAdmin && !isGvcn) {
    return (
      <div className="page-container fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <ShieldAlert size={60} style={{ color: 'var(--color-danger)', marginBottom: '16px' }} />
        <h2 style={{ fontWeight: 800, marginBottom: '8px' }}>Quyền Truy Cập Bị Từ Chối</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '480px' }}>
          Bạn không có quyền thực hiện chức năng Quản lý tiêu chí thi đua. Trang này chỉ dành riêng cho Admin Quản Trị Viên và Giáo Viên Chủ Nhiệm.
        </p>
      </div>
    );
  }

  const [criteria, setCriteria] = useState<TieuChi[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<TieuChi | null>(null);
  const [formData, setFormData] = useState({
    ten_tieu_chi: '',
    nhom_tieu_chi: '',
    loai: 'Tru' as 'Cong' | 'Tru',
    so_diem: '2.0',
    trang_thai: true
  });

  const token = localStorage.getItem('sb-access-token');

  const fetchCriteria = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/criteria?showAll=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCriteria(data);
          setLoading(false);
          return;
        }
      }
    } catch {
      // fallback
    }

    const fallback = getStoredData('app_criteria_list', DEFAULT_CRITERIA);
    setCriteria(fallback);
    setLoading(false);
  }, [token, BACKEND_URL]);

  useEffect(() => {
    fetchCriteria();
  }, [fetchCriteria]);

  const handleOpenModal = (tc?: TieuChi) => {
    setMessage(null);
    if (tc) {
      setEditingCriteria(tc);
      setFormData({
        ten_tieu_chi: tc.ten_tieu_chi,
        nhom_tieu_chi: tc.nhom_tieu_chi,
        loai: tc.loai,
        so_diem: String(Number(tc.so_diem)),
        trang_thai: tc.trang_thai
      });
    } else {
      setEditingCriteria(null);
      setFormData({
        ten_tieu_chi: '',
        nhom_tieu_chi: 'Nền nếp',
        loai: 'Tru',
        so_diem: '2.0',
        trang_thai: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ten_tieu_chi || !formData.nhom_tieu_chi) {
      setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ tên và nhóm tiêu chí.' });
      return;
    }

    let updated: TieuChi[];
    if (editingCriteria) {
      updated = criteria.map((tc) =>
        tc.tieu_chi_id === editingCriteria.tieu_chi_id
          ? {
              ...tc,
              ten_tieu_chi: formData.ten_tieu_chi.trim(),
              nhom_tieu_chi: formData.nhom_tieu_chi.trim(),
              loai: formData.loai,
              so_diem: parseFloat(formData.so_diem).toFixed(2),
              trang_thai: formData.trang_thai,
            }
          : tc
      );
    } else {
      const newTc: TieuChi = {
        tieu_chi_id: Date.now(),
        ten_tieu_chi: formData.ten_tieu_chi.trim(),
        nhom_tieu_chi: formData.nhom_tieu_chi.trim(),
        loai: formData.loai,
        so_diem: parseFloat(formData.so_diem).toFixed(2),
        trang_thai: formData.trang_thai,
      };
      updated = [newTc, ...criteria];
    }

    setCriteria(updated);
    setStoredData('app_criteria_list', updated);
    setIsModalOpen(false);
    setMessage({
      type: 'success',
      text: editingCriteria ? 'Đã cập nhật tiêu chí thi đua thành công!' : 'Đã thêm tiêu chí mới thành công!',
    });

    try {
      const payload = {
        ten_tieu_chi: formData.ten_tieu_chi,
        nhom_tieu_chi: formData.nhom_tieu_chi,
        loai: formData.loai,
        so_diem: parseFloat(formData.so_diem),
        trang_thai: formData.trang_thai
      };
      if (editingCriteria) {
        await fetch(`${BACKEND_URL}/criteria/${editingCriteria.tieu_chi_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${BACKEND_URL}/criteria`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      }
    } catch {
      // offline ok
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tiêu chí thi đua này?')) return;
    const updated = criteria.filter((tc) => tc.tieu_chi_id !== id);
    setCriteria(updated);
    setStoredData('app_criteria_list', updated);
    setMessage({ type: 'success', text: 'Đã xóa tiêu chí thành công!' });

    try {
      await fetch(`${BACKEND_URL}/criteria/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // offline ok
    }
  };

  // Lọc tiêu chí
  const filteredCriteria = criteria.filter(tc => {
    const matchSearch = tc.ten_tieu_chi.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        tc.nhom_tieu_chi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGroup = selectedGroup === 'all' || tc.nhom_tieu_chi === selectedGroup;
    return matchSearch && matchGroup;
  });

  // Lấy danh sách nhóm tiêu chí để tạo bộ lọc
  const uniqueGroups = Array.from(new Set(criteria.map(tc => tc.nhom_tieu_chi)));

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <h2>Quản Lý Tiêu Chí Thi Đua</h2>
          <p>Thiết lập danh mục lỗi vi phạm (trừ điểm), thành tích (cộng điểm) và thang điểm chấm</p>
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Thêm Tiêu Chí
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: message.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', color: message.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, fontSize: '0.9rem' }}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Bộ lọc và Tìm kiếm */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Tìm theo tên tiêu chí hoặc nhóm..." 
            className="form-input" 
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="form-select" 
          style={{ width: '220px' }}
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="all">-- Lọc theo nhóm tiêu chí --</option>
          {uniqueGroups.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Danh sách tiêu chí */}
      <div className="glass-card" style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên tiêu chí thi đua</th>
                  <th>Nhóm tiêu chí</th>
                  <th>Loại</th>
                  <th>Số điểm thang chấm</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCriteria.map(tc => (
                  <tr key={tc.tieu_chi_id} style={{ opacity: tc.trang_thai ? 1 : 0.55 }}>
                    <td style={{ fontWeight: 600 }}>{tc.ten_tieu_chi}</td>
                    <td>
                      <span className="badge badge-primary">{tc.nhom_tieu_chi}</span>
                    </td>
                    <td>
                      <span className={`badge ${tc.loai === 'Cong' ? 'badge-success' : 'badge-danger'}`}>
                        {tc.loai === 'Cong' ? 'Điểm cộng (Thành tích)' : 'Điểm trừ (Vi phạm)'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: tc.loai === 'Cong' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {tc.loai === 'Cong' ? '+' : '-'}{Number(tc.so_diem)}đ
                    </td>
                    <td>
                      <span className={`badge ${tc.trang_thai ? 'badge-success' : 'badge-muted'}`}>
                        {tc.trang_thai ? 'Hoạt động' : 'Tắt/Khóa'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleOpenModal(tc)} title="Sửa tiêu chí">
                          <Edit2 size={14} />
                        </button>
                        {tc.trang_thai && (
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tc.tieu_chi_id)} title="Xóa mềm">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCriteria.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      Không tìm thấy tiêu chí thi đua nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa tiêu chí */}
      {isModalOpen && (
        <div className="mobile-modal-overlay">
          <div className="mobile-modal-content glass-card" style={{ maxWidth: '550px', margin: 'auto', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', padding: '24px', borderRadius: '16px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} style={{ color: 'var(--color-primary)' }} />
                {editingCriteria ? 'Sửa Tiêu Chí Thi Đua' : 'Thêm Tiêu Chí Thi Đua'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.4rem' }}>✕</button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Tên tiêu chí thi đua</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Đi muộn, Không mặc đồng phục, Giúp đỡ bạn..."
                  value={formData.ten_tieu_chi}
                  onChange={(e) => setFormData({ ...formData, ten_tieu_chi: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nhóm tiêu chí</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Nề nếp / Tác phong, Học tập, Chuyên cần..."
                  value={formData.nhom_tieu_chi}
                  onChange={(e) => setFormData({ ...formData, nhom_tieu_chi: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Loại tiêu chí</label>
                  <select 
                    className="form-select"
                    value={formData.loai}
                    onChange={(e) => setFormData({ ...formData, loai: e.target.value as 'Cong' | 'Tru' })}
                  >
                    <option value="Tru">Điểm trừ (Lỗi vi phạm)</option>
                    <option value="Cong">Điểm cộng (Thành tích)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Số điểm thang chấm</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.1" 
                    max="100" 
                    className="form-input" 
                    value={formData.so_diem}
                    onChange={(e) => setFormData({ ...formData, so_diem: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '4px' }}>
                <input 
                  type="checkbox" 
                  id="trang_thai" 
                  checked={formData.trang_thai}
                  onChange={(e) => setFormData({ ...formData, trang_thai: e.target.checked })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="trang_thai" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>Kích hoạt hoạt động (Cho phép chấm điểm)</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={16} /> Lưu Lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
