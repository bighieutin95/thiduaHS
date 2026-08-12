import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Award, Users, BookOpen } from 'lucide-react';
import '../styles/login.css';

export default function LoginPage() {
  const { signInWithGoogle, signInMock, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu người dùng đã đăng nhập, tự động chuyển hướng về trang Dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="login-page">
        <div className="bg-gradient"></div>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="bg-gradient"></div>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      <div className="login-card fade-in">
        <div className="login-logo">
          <div className="login-logo-icon">
            <Award size={28} />
          </div>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>
            ThiDua<span style={{ color: '#60a5fa' }}>HS</span>
          </span>
        </div>

        <h1 className="login-title">Hệ Thống Thi Đua</h1>
        <p className="login-subtitle">
          Chấm điểm thi đua học sinh hàng tuần và tổng hợp xếp loại cuối tháng thông minh, minh bạch
        </p>

        <button className="btn-google" onClick={signInWithGoogle} style={{ marginBottom: '12px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.31l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Đăng nhập với Google
        </button>

        <div className="login-divider">HOẶC ĐĂNG NHẬP NHANH (DEMO)</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <button className="btn btn-sm btn-secondary" onClick={() => signInMock('admin@thiduahs.com')} style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
            🔑 Admin
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => signInMock('gvcn10a1@thiduahs.com')} style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
            💼 GVCN (10A1)
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => signInMock('loptruong@thiduahs.com')} style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
            🎓 Lớp Trưởng
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => signInMock('totruong1@thiduahs.com')} style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
            🚩 Tổ Trưởng
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => signInMock('hocsinh1@thiduahs.com')} style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)', gridColumn: 'span 2' }}>
            👦 Học Sinh (Xem điểm cá nhân & cả lớp)
          </button>
        </div>

        <div className="login-divider">HỆ THỐNG TỰ QUẢN</div>

        <div className="login-features">
          <div className="login-feature-item">
            <div className="login-feature-icon">
              <Shield size={18} style={{ color: '#3b82f6' }} />
            </div>
            <span>Google OAuth bảo mật & nhanh chóng</span>
          </div>

          <div className="login-feature-item">
            <div className="login-feature-icon">
              <Users size={18} style={{ color: '#8b5cf6' }} />
            </div>
            <span>Phân quyền chi tiết cho ban cán sự lớp</span>
          </div>

          <div className="login-feature-item">
            <div className="login-feature-icon">
              <BookOpen size={18} style={{ color: '#06b6d4' }} />
            </div>
            <span>Báo cáo xếp loại tuần và tháng tự động</span>
          </div>
        </div>

        <div className="login-footer">
          Bản quyền thuộc về Dự án ThiDuaHS © 2026<br />
          Thiết kế phục vụ cho giáo dục phổ thông Việt Nam
        </div>
      </div>
    </div>
  );
}
