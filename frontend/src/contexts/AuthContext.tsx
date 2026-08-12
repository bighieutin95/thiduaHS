import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
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
}

interface UserProfile {
  user_id: string;
  email: string;
  ho_ten: string | null;
  avatar_url: string | null;
  vai_tro_he_thong: 'Admin' | 'User';
  hoc_sinh: HocSinhInfo | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isCanBoLop: boolean; // Lớp trưởng hoặc Lớp phó
  isToTruong: boolean; // Tổ trưởng hoặc Tổ phó
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy profile từ backend NestJS
  const fetchProfile = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
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
      if (session?.access_token) {
        fetchProfile(session.access_token).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Lắng nghe thay đổi trạng thái auth (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.access_token) {
          await fetchProfile(session.access_token);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
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

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
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

// Hook tiện lợi để sử dụng AuthContext
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return ctx;
}
