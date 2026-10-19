import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Award, Users, BookOpen } from 'lucide-react';
import '../styles/login.css';

export default function LoginPage() {
  const { signInMock, user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Nếu người dùng đã đăng nhập, tự động chuyển hướng về trang Dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await signInMock(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Mật khẩu hoặc email không chính xác!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Thidua@2026');
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await signInMock(demoEmail, 'Thidua@2026');
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi đăng nhập nhanh!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isSubmitting) {
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
        
        {/* FORM ĐĂNG NHẬP CHÍNH THỨC */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0 10px 0', width: '100%' }}>
          {errorMsg && (
            <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              ⚠️ {errorMsg}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>Email tài khoản</label>
            <input
              type="email"
              placeholder="nhap-email@thiduahs.com..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.95rem' }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.95rem' }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', minHeight: '44px', fontWeight: 'bold', fontSize: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
            ĐĂNG NHẬP
          </button>
        </form>

        // Google sign-in button removed per user request

        <div className="login-divider">HOẶC ĐĂNG NHẬP NHANH LỚP 11C2 (DEMO)</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', width: '100%' }}>
          <button className="btn btn-sm btn-secondary" onClick={() => handleDemoClick('admin@thiduahs.com')} style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.06)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
            🔑 Admin
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => handleDemoClick('gvcn11c2@thiduahs.com')} style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.06)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
            💼 GVCN (11C2)
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => handleDemoClick('hs2102106193@thiduahs.com')} style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.06)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
            🎓 Lớp Trưởng
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => handleDemoClick('hs2001272118@thiduahs.com')} style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.06)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
            🚩 Tổ Trưởng Tổ 1
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => handleDemoClick('hs2001272017@thiduahs.com')} style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.06)', color: 'white', borderColor: 'rgba(255,255,255,0.1)', gridColumn: 'span 2' }}>
            👦 Học Sinh (Xem điểm cá nhân & cả lớp)
          </button>
        </div>

        <div className="login-divider">HỆ THỐNG TỰ QUẢN THI ĐUA</div>

        <div className="login-features">
          <div className="login-feature-item">
            <div className="login-feature-icon">
              <Shield size={18} style={{ color: '#3b82f6' }} />
            </div>
            <span>Bảo mật dữ liệu học đường an toàn</span>
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
