import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { BACKEND_URL } from '../config';

// --- Kiểu dữ liệu ---
interface HocSinhInfo {
  hoc_sinh_id: number;
  lop_id: number;
  to_id: number | null;
  ho_ten: string;
  ma_hoc_sinh: string | null;
  vai_tro_thi_dua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho' | 'HocSinh';
  ten_to: string | null;
  ten_lop: string | null;
}

interface UserProfile {
  user_id: string;
  email: string;
  ho_ten: string | null;
  avatar_url: string | null;
  vai_tro_he_thong: 'Admin' | 'User';
  hoc_sinh: HocSinhInfo | null;
  gvcn_lop: { lop_id: number; ten_lop: string } | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  // signInWithGoogle removed per user request
  signInMock: (email: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isCanBoLop: boolean;
  isToTruong: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getMockProfile = (emailOrAccount: string): UserProfile => {
  let email = emailOrAccount.toLowerCase();
  if (email === 'big_hieu' || email === 'admin') email = 'admin@thiduahs.com';
  else if (email === 'gvcn' || email === 'gvcn11c2') email = 'gvcn11c2@thiduahs.com';
  else if (email === 'loptruong') email = 'hs2102106193@thiduahs.com';
  else if (email === 'totruong' || email === 'totruong1') email = 'hs2001272118@thiduahs.com';
  else if (email === 'hocsinh' || email === 'hocsinh1') email = 'hs2001272017@thiduahs.com';

  let vaiTroHeThong: 'Admin' | 'User' = 'User';
  let vaiTroThiDua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho' | 'HocSinh' = 'HocSinh';
  let hoTen = 'Người Dùng';

  if (email === 'admin@thiduahs.com') {
    vaiTroHeThong = 'Admin';
    hoTen = 'Admin (big_hieu)';
  } else if (email === 'gvcn11c2@thiduahs.com' || email === 'gvcn10a1@thiduahs.com') {
    hoTen = 'Thầy/Cô GVCN (11C2)';
  } else if (email === 'hs2102106193@thiduahs.com') {
    vaiTroThiDua = 'LopTruong';
    hoTen = 'Liêng Jrang Thu An (Lớp trưởng)';
  } else if (email === 'hs2001272118@thiduahs.com') {
    vaiTroThiDua = 'ToTruong';
    hoTen = 'Tou Prong Khúy (Tổ trưởng 1)';
  } else {
    hoTen = 'Học Sinh Lớp 11C2';
  }

  const isTeacher = email === 'admin@thiduahs.com' || email === 'gvcn11c2@thiduahs.com';

  return {
    user_id: email === 'admin@thiduahs.com' ? '00000000-0000-4000-a000-000000000001' : '11111111-1111-4111-a111-111111111111',
    email,
    ho_ten: hoTen,
    avatar_url: null,
    vai_tro_he_thong: vaiTroHeThong,
    hoc_sinh: isTeacher ? null : {
      hoc_sinh_id: 1,
      lop_id: 4,
      to_id: 10,
      ho_ten: hoTen,
      ma_hoc_sinh: email.startsWith('hs') ? email.replace('hs', '').split('@')[0] : '2102106193',
      vai_tro_thi_dua: vaiTroThiDua,
      ten_to: 'Tổ 1',
      ten_lop: '11C2',
    },
    gvcn_lop: email === 'gvcn11c2@thiduahs.com' ? { lop_id: 4, ten_lop: '11C2' } : null,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy profile từ backend NestJS, có dự phòng client-side
  const fetchProfile = useCallback(async (accessToken?: string) => {
    const token = accessToken || localStorage.getItem('sb-access-token');
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        return;
      }
    } catch (err) {
      console.warn('Lỗi kết nối profile, kích hoạt mock profile:', err);
    }

    if (token.startsWith('mock-token-')) {
      const email = token.replace('mock-token-', '');
      setProfile(getMockProfile(email));
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Timeout an toàn: Đảm bảo tối đa 1.5s là dừng loading, không bao giờ kẹt màn hình trắng
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 1500);

    // Lấy session hiện tại khi ứng dụng khởi động
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      
      const token = session?.access_token || localStorage.getItem('sb-access-token');
      if (token) {
        if (session?.access_token) {
          localStorage.setItem('sb-access-token', session.access_token);
        }
        fetchProfile(token).finally(() => {
          if (isMounted) setIsLoading(false);
        });
      } else {
        // Hỗ trợ khôi phục user giả lập từ token trong localStorage khi reload trang
        const mockToken = localStorage.getItem('sb-access-token');
        if (mockToken && mockToken.startsWith('mock-token-')) {
          const email = mockToken.replace('mock-token-', '');
          const mockProfile = getMockProfile(email);
          const mockUser = {
            id: mockProfile.user_id,
            email,
          } as any;
          setUser(mockUser);
          setProfile(mockProfile);
          setSession({ access_token: mockToken, user: mockUser } as any);
          fetchProfile(mockToken).finally(() => {
            if (isMounted) setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      }
    }).catch((err) => {
      console.warn('Lỗi getSession:', err);
      if (isMounted) setIsLoading(false);
    });

    // Lắng nghe thay đổi trạng thái auth từ Supabase
    let subscription: any = null;
    try {
      const authSub = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!isMounted) return;
          if (session) {
            setSession(session);
            setUser(session.user);
            localStorage.setItem('sb-access-token', session.access_token);
            await fetchProfile(session.access_token);
          }
        }
      );
      subscription = authSub?.data?.subscription;
    } catch (e) {
      console.warn('Lỗi onAuthStateChange:', e);
    }

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Google sign-in removed per user request

  const signInMock = async (account: string, password?: string) => {
    setIsLoading(true);
    const cleanAccount = account.trim().toLowerCase();
    const cleanPwd = (password || '').trim();

    // Kiểm tra tính hợp lệ cục bộ
    const isAdminAccount =
      (cleanAccount === 'big_hieu' || cleanAccount === 'admin@thiduahs.com' || cleanAccount === 'admin') &&
      (cleanPwd === 'HIEU@124' || cleanPwd === 'hieu@124' || cleanPwd === 'Thidua@2026' || cleanPwd === 'admin');

    const isGVCN =
      (cleanAccount === 'gvcn11c2@thiduahs.com' || cleanAccount === 'gvcn') &&
      (cleanPwd === 'Thidua@2026' || cleanPwd === '123456');

    const isLopTruong =
      (cleanAccount === 'hs2102106193@thiduahs.com' || cleanAccount === 'loptruong') &&
      (cleanPwd === 'Thidua@2026' || cleanPwd === '123456');

    const isHocSinh =
      (cleanAccount === 'hs2001272017@thiduahs.com' || cleanAccount.startsWith('hs')) &&
      (cleanPwd === 'Thidua@2026' || cleanPwd === '123456');

    // Thử gọi backend nếu có
    try {
      const res = await fetch(`${BACKEND_URL}/auth/mock-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, email: account, username: account, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('sb-access-token', data.access_token);
        
        let resolvedEmail = account;
        if (data.access_token && data.access_token.startsWith('mock-token-')) {
          resolvedEmail = data.access_token.replace('mock-token-', '');
        }

        const mockProfile = getMockProfile(resolvedEmail);
        const mockUser = {
          id: mockProfile.user_id,
          email: resolvedEmail,
        } as any;
        
        setUser(mockUser);
        setProfile(mockProfile);
        setSession({
          access_token: data.access_token,
          user: mockUser,
        } as any);

        await fetchProfile(data.access_token);
        setIsLoading(false);
        return;
      }
    } catch {
      console.warn('Backend không phản hồi, tự động chuyển sang chế độ xác thực dự phòng');
    }

    // Nếu backend không phản hồi hoặc trả về lỗi, kiểm tra xác thực dự phòng
    if (isAdminAccount || isGVCN || isLopTruong || isHocSinh || cleanPwd === 'HIEU@124' || cleanPwd === 'Thidua@2026') {
      let resolvedEmail = cleanAccount;
      if (cleanAccount === 'big_hieu' || cleanAccount === 'admin') resolvedEmail = 'admin@thiduahs.com';
      else if (cleanAccount === 'gvcn') resolvedEmail = 'gvcn11c2@thiduahs.com';
      else if (cleanAccount === 'loptruong') resolvedEmail = 'hs2102106193@thiduahs.com';

      const token = `mock-token-${resolvedEmail}`;
      localStorage.setItem('sb-access-token', token);

      const mockProfile = getMockProfile(resolvedEmail);
      const mockUser = {
        id: mockProfile.user_id,
        email: resolvedEmail,
      } as any;

      setUser(mockUser);
      setProfile(mockProfile);
      setSession({
        access_token: token,
        user: mockUser,
      } as any);

      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    throw new Error('Mật khẩu hoặc tài khoản đăng nhập không chính xác!');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sb-access-token');
    setProfile(null);
    setSession(null);
    setUser(null);
  };

  // Các hàm kiểm tra quyền nhanh
  const isAdmin = profile?.vai_tro_he_thong === 'Admin';
  const isCanBoLop =
    profile?.hoc_sinh?.vai_tro_thi_dua === 'LopTruong' ||
    profile?.hoc_sinh?.vai_tro_thi_dua === 'LopPho';
  const isToTruong =
    profile?.hoc_sinh?.vai_tro_thi_dua === 'ToTruong' ||
    profile?.hoc_sinh?.vai_tro_thi_dua === 'ToPho';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        // signInWithGoogle removed per user request
        signInMock,
        signOut,
        isAdmin,
        isCanBoLop,
        isToTruong,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return ctx;
}
