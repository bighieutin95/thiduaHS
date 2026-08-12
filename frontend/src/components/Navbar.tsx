import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, Menu, LogOut, Award } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { profile, signOut } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const getRoleLabel = () => {
    if (profile?.vai_tro_he_thong === 'Admin') return 'Quản trị viên';
    const vt = profile?.hoc_sinh?.vai_tro_thi_dua;
    switch (vt) {
      case 'LopTruong': return `Lớp trưởng ${profile?.hoc_sinh?.ten_lop || ''}`;
      case 'LopPho': return `Lớp phó ${profile?.hoc_sinh?.ten_lop || ''}`;
      case 'ToTruong': return `Tổ trưởng ${profile?.hoc_sinh?.ten_to || ''} - ${profile?.hoc_sinh?.ten_lop || ''}`;
      case 'ToPho': return `Tổ phó ${profile?.hoc_sinh?.ten_to || ''} - ${profile?.hoc_sinh?.ten_lop || ''}`;
      default: return `Học sinh ${profile?.hoc_sinh?.ten_lop || ''}`;
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            Năm học: 2026-2027
          </span>
        </div>
      </div>

      <div className="topbar-right">
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Chuyển chế độ tối/sáng">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>

        {profile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={profile.avatar_url || 'https://via.placeholder.com/150'}
              alt={profile.ho_ten || 'User'}
              className="user-avatar"
            />
            <div className="user-details" style={{ display: 'none' /* Ẩn trên mobile */ }}>
              <span className="user-name">{profile.ho_ten}</span>
              <span className="user-role">{getRoleLabel()}</span>
            </div>
            <button
              onClick={signOut}
              className="theme-toggle-btn"
              title="Đăng xuất"
              style={{ marginLeft: '4px' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
