import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Award, FileSpreadsheet, Users, Settings } from 'lucide-react';
import '../styles/mobile-app.css';

export default function BottomNav() {
  const { isAdmin, isCanBoLop, isToTruong } = useAuth();
  const canGrade = isAdmin || isCanBoLop || isToTruong;
  const canManageStudents = isAdmin || isCanBoLop;

  return (
    <nav className="bottom-nav">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="bottom-nav-icon">
          <LayoutDashboard size={20} />
        </div>
        <span className="bottom-nav-label">Tổng quan</span>
      </NavLink>

      {canGrade && (
        <NavLink
          to="/grading"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">
            <Award size={20} />
          </div>
          <span className="bottom-nav-label">Chấm điểm</span>
        </NavLink>
      )}

      {canManageStudents && (
        <NavLink
          to="/students"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">
            <Users size={20} />
          </div>
          <span className="bottom-nav-label">Học sinh</span>
        </NavLink>
      )}

      <NavLink
        to="/reports"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="bottom-nav-icon">
          <FileSpreadsheet size={20} />
        </div>
        <span className="bottom-nav-label">Báo cáo</span>
      </NavLink>

      {isAdmin && (
        <NavLink
          to="/role-config"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">
            <Settings size={20} />
          </div>
          <span className="bottom-nav-label">Phân quyền</span>
        </NavLink>
      )}
    </nav>
  );
}
