import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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
  signInWithGoogle: () => Promise<void>;
  signInMock: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isCanBoLop: boolean;
  isToTruong: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy profile từ backend NestJS
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
      } else {
        // Nếu token hết hạn hoặc lỗi, xóa sạch session
        setProfile(null);
        setUser(null);
        setSession(null);
        localStorage.removeItem('sb-access-token');
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin profile:', err);
    }
  }, []);

  useEffect(() => {
    // Lấy session hiện tại khi ứng dụng khởi động
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      const token = session?.access_token || localStorage.getItem('sb-access-token');
      if (token) {
        if (session?.access_token) {
          localStorage.setItem('sb-access-token', session.access_token);
        }
        fetchProfile(token).finally(() => setIsLoading(false));
      } else {
        // Hỗ trợ khôi phục user giả lập từ token trong localStorage khi reload trang
        const mockToken = localStorage.getItem('sb-access-token');
        if (mockToken && mockToken.startsWith('mock-token-')) {
          const email = mockToken.replace('mock-token-', '');
          const getMockUuid = (e: string) => {
            switch (e) {
              case 'admin@thiduahs.com': return '00000000-0000-4000-a000-000000000001';
              case 'loptruong@thiduahs.com': return '00000000-0000-4000-a000-000000000002';
              case 'totruong1@thiduahs.com': return '00000000-0000-4000-a000-000000000003';
              case 'hocsinh1@thiduahs.com': return '00000000-0000-4000-a000-000000000004';
              case 'gvcn10a1@thiduahs.com': return '00000000-0000-4000-a000-000000000005';
              default: return '11111111-1111-4111-a111-111111111111';
            }
          };

          const mockUser = {
            id: getMockUuid(email),
            email,
          } as any;
          setUser(mockUser);
          setSession({ access_token: mockToken, user: mockUser } as any);
          fetchProfile(mockToken).finally(() => setIsLoading(false));
        } else {
          setIsLoading(false);
        }
      }
    });

    // Lắng nghe thay đổi trạng thái auth từ Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user);
          localStorage.setItem('sb-access-token', session.access_token);
          await fetchProfile(session.access_token);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const signInMock = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/mock-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('sb-access-token', data.access_token);
        
        const getMockUuid = (e: string) => {
          switch (e) {
            case 'admin@thiduahs.com': return '00000000-0000-4000-a000-000000000001';
            case 'loptruong@thiduahs.com': return '00000000-0000-4000-a000-000000000002';
            case 'totruong1@thiduahs.com': return '00000000-0000-4000-a000-000000000003';
            case 'hocsinh1@thiduahs.com': return '00000000-0000-4000-a000-000000000004';
            case 'gvcn10a1@thiduahs.com': return '00000000-0000-4000-a000-000000000005';
            default: return '11111111-1111-4111-a111-111111111111';
          }
        };

        const mockUser = {
          id: getMockUuid(email),
          email,
        } as any;
        
        setUser(mockUser);
        setSession({
          access_token: data.access_token,
          user: mockUser,
        } as any);

        await fetchProfile(data.access_token);
      }
    } catch (err) {
      console.error('Lỗi đăng nhập giả lập:', err);
    } finally {
      setIsLoading(false);
    }
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
        signInWithGoogle,
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
