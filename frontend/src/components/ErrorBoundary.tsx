import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'linear-gradient(135deg, #0f2460 0%, #1a3a8f 50%, #0d1b4a 100%)',
            color: 'white',
            fontFamily: 'sans-serif',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              padding: '32px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#f87171' }}>
              ⚠️ Đã có sự cố hiển thị
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '20px', lineHeight: 1.6 }}>
              {this.state.error?.message || 'Ứng dụng gặp lỗi ngoài dự kiến.'}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Xóa cache & Về trang đăng nhập
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
