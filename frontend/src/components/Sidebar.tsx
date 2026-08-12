import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Award, FileSpreadsheet, Settings, X, GraduationCap } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile, isAdmin, isCanBoLop, isToTruong } = useAuth();

  // Kiểm tra xem user có quyền truy cập mục Chấm Điểm không
  const canGrade = isAdmin || isCanBoLop || isToTruong;

  const getRoleLabel = () => {
    if (profile?.vai_tro_he_thong === 'Admin') return 'Quản trị viên';
    const vt = profile?.hoc_sinh?.vai_tro_thi_dua;
    switch (vt) {
      case 'LopTruong': return 'Lớp trưởng';
      case 'LopPho': return 'Lớp phó';
      case 'ToTruong': return 'Tổ trưởng';
      case 'ToPho': return 'Tổ phó';
      default: return 'Học sinh';
    }
  };

  return (
    <>
      {/* Backdrop cho mobile */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <GraduationCap size={22} />
          </div>
          <span className="sidebar-logo-text">
            ThiDua<span style={{ color: 'var(--color-primary)' }}>HS</span>
          </span>
          <button
            className="menu-toggle"
            onClick={onClose}
            style={{ marginLeft: 'auto', display: isOpen ? 'block' : 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-menu">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Tổng quan</span>
          </NavLink>

          {canGrade && (
            <NavLink
              to="/grading"
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Award size={18} />
              <span>Chấm điểm thi đua</span>
            </NavLink>
          )}

          <NavLink
            to="/reports"
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <FileSpreadsheet size={18} />
            <span>Báo cáo tổng kết</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/role-config"
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Settings size={18} />
              <span>Phân quyền lớp học</span>
            </NavLink>
          )}
        </nav>

        {profile && (
          <div className="sidebar-footer">
            <div className="user-info-card">
              <img
                src={profile.avatar_url || 'https://via.placeholder.com/150'}
                alt={profile.ho_ten || 'User'}
                className="user-avatar"
              />
              <div className="user-details">
                <span className="user-name" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile.ho_ten}
                </span>
                <span className="user-role">{getRoleLabel()}</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
