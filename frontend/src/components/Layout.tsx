import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../styles/globals.css';
import '../styles/layout.css';

export default function Layout() {
  const { session, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Nếu đang loading thông tin auth, hiển thị màn hình chờ
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-page)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, chuyển hướng sang trang Login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className="main-content">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Render Area */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
