import React from 'react';

export interface RoleAvatarProps {
  role?: string;
  size?: number; // size in px, default 36
  className?: string;
  title?: string;
}

export function getRoleAvatarInfo(role?: string) {
  const r = (role || '').trim().toLowerCase();
  
  // 1. Quản trị viên (Admin) -> Chìa khóa 🔑
  if (r.includes('admin') || r.includes('chìa khóa') || r.includes('chia khoa') || r === 'quantri') {
    return {
      icon: '🔑',
      title: 'Quản trị viên (Admin)',
      bg: 'linear-gradient(135deg, #fef08a 0%, #facc15 100%)',
      border: '#ca8a04',
      badgeBg: '#fef9c3',
      badgeText: '#854d0e',
      label: 'Admin',
    };
  }

  // 2. Giáo viên chủ nhiệm (GVCN) -> Cặp công tác 💼
  if (r.includes('gvcn') || r.includes('giáo viên') || r.includes('giao vien') || r.includes('chủ nhiệm')) {
    return {
      icon: '💼',
      title: 'Giáo viên Chủ nhiệm',
      bg: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 100%)',
      border: '#6366f1',
      badgeBg: '#eef2ff',
      badgeText: '#3730a3',
      label: 'GVCN',
    };
  }

  // 3. Lớp trưởng -> Mũ cử nhân 🎓
  if (r.includes('loptruong') || r.includes('lớp trưởng') || r.includes('lop truong')) {
    return {
      icon: '🎓',
      title: 'Lớp trưởng',
      bg: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
      border: '#2563eb',
      badgeBg: '#eff6ff',
      badgeText: '#1e40af',
      label: 'Lớp trưởng',
    };
  }

  // 4. Lớp phó -> Sổ sách / Bút vở 📑
  if (r.includes('loppho') || r.includes('lớp phó') || r.includes('lop pho')) {
    return {
      icon: '📑',
      title: 'Lớp phó',
      bg: 'linear-gradient(135deg, #ccfbf1 0%, #5eead4 100%)',
      border: '#0d9488',
      badgeBg: '#f0fdfa',
      badgeText: '#115e59',
      label: 'Lớp phó',
    };
  }

  // 5. Tổ trưởng -> Cờ thi đua 🚩
  if (r.includes('totruong') || r.includes('tổ trưởng') || r.includes('to truong')) {
    return {
      icon: '🚩',
      title: 'Tổ trưởng',
      bg: 'linear-gradient(135deg, #ffedd5 0%, #fdba74 100%)',
      border: '#ea580c',
      badgeBg: '#fff7ed',
      badgeText: '#9a3412',
      label: 'Tổ trưởng',
    };
  }

  // 6. Tổ phó -> Thẻ ghi chú 🏷️
  if (r.includes('topho') || r.includes('tổ phó') || r.includes('to pho')) {
    return {
      icon: '🏷️',
      title: 'Tổ phó',
      bg: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
      border: '#d97706',
      badgeBg: '#fffbeb',
      badgeText: '#92400e',
      label: 'Tổ phó',
    };
  }

  // 7. Học sinh -> Dễ thương 👦 (hoặc học sinh nói chung)
  return {
    icon: '👦',
    title: 'Học sinh',
    bg: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
    border: '#64748b',
    badgeBg: '#f8fafc',
    badgeText: '#334155',
    label: 'Học sinh',
  };
}

export const RoleAvatar: React.FC<RoleAvatarProps> = ({ role, size = 36, className = '', title }) => {
  const info = getRoleAvatarInfo(role);
  const displayTitle = title || info.title;

  return (
    <div
      className={className}
      title={displayTitle}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        background: info.bg,
        border: `2px solid ${info.border}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${Math.round(size * 0.52)}px`,
        userSelect: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        lineHeight: 1,
        transition: 'transform 0.15s ease',
      }}
    >
      <span role="img" aria-label={displayTitle}>
        {info.icon}
      </span>
    </div>
  );
};

export default RoleAvatar;
