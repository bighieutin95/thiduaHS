import { createClient } from '@supabase/supabase-js';

// Cấu hình Supabase Client an toàn, có giá trị dự phòng nếu chưa cấu hình biến môi trường
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://lhqzllnnzhdktesjlgwq.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
