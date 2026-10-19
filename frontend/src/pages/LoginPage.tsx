import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Award, Lock, User as UserIcon } from 'lucide-react';
import '../styles/login.css';

export default function LoginPage() {
  const { signInMock, user } = useAuth();
  const navigate = useNavigate();

  const [account, setAccount] = useState('');
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
    const cleanAccount = account.trim();
    if (!cleanAccount || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await signInMock(cleanAccount, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Mật khẩu hoặc tài khoản đăng nhập không chính xác!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoAccount: string, defaultPassword: string = 'Thidua@2026') => {
    setAccount(demoAccount);
    setPassword(defaultPassword);
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await signInMock(demoAccount, defaultPassword);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi đăng nhập nhanh!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="bg-gradient"></div>

      <div className="login-card fade-in" style={{ maxWidth: '400px', padding: '32px 24px' }}>
        {/* Logo & Tiêu đề */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
              marginBottom: '12px',
            }}
          >
            <Award size={32} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', margin: '0 0 6px 0' }}>
            ThiDua<span style={{ color: '#60a5fa' }}>HS</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>
            Hệ Thống Thi Đua Học Sinh
          </p>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMsg && (
          <div
            style={{
              color: '#f87171',
              fontSize: '0.85rem',
              textAlign: 'center',
              background: 'rgba(239, 68, 68, 0.12)',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              marginBottom: '16px',
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form Đăng Nhập Đơn Giản */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500, marginBottom: '6px' }}>
              Tài khoản (Username hoặc Email)
            </label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Nhập big_hieu hoặc email..."
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                disabled={isSubmitting}
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(0,0,0,0.25)',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500, marginBottom: '6px' }}>
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(0,0,0,0.25)',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '6px',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: isSubmitting ? '#60a5fa' : '#2563eb',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {isSubmitting ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        {/* Nút Đăng Nhập Nhanh (Demo) */}
        <div style={{ margin: '20px 0 12px 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Đăng nhập nhanh (1 chạm)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('big_hieu', 'HIEU@124')}
              disabled={isSubmitting}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              👑 Admin (big_hieu)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('gvcn11c2@thiduahs.com', 'Thidua@2026')}
              disabled={isSubmitting}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              💼 GVCN (11C2)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('hs2102106193@thiduahs.com', 'Thidua@2026')}
              disabled={isSubmitting}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              🎓 Lớp Trưởng
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('hs2001272017@thiduahs.com', 'Thidua@2026')}
              disabled={isSubmitting}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              👦 Học Sinh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
