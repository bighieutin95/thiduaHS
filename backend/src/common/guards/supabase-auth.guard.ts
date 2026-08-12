import {
  CanActivate, ExecutionContext, Injectable,
  UnauthorizedException, Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';

/**
 * Guard xác thực JWT Token của Supabase.
 * Mỗi request có protected route đều phải qua guard này.
 * Guard sẽ gắn thông tin `request.user` sau khi xác thực thành công.
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);
  private readonly supabase: SupabaseClient;

  constructor(private readonly config: ConfigService) {
    this.supabase = createClient(
      config.get<string>('SUPABASE_URL')!,
      config.get<string>('SUPABASE_ANON_KEY')!,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Thiếu token xác thực. Vui lòng đăng nhập.');
    }

    const token = authHeader.split(' ')[1];

    // Hỗ trợ đăng nhập giả lập không cần Google OAuth
    if (token.startsWith('mock-token-')) {
      const email = token.replace('mock-token-', '');
      const mockUser = {
        id: `mock-uid-${email.replace(/[@.]/g, '-')}`,
        email: email,
        raw_user_meta_data: {
          full_name: email.split('@')[0].toUpperCase(),
          name: email.split('@')[0].toUpperCase(),
        },
      };
      (request as any).user = mockUser;
      (request as any).accessToken = token;
      return true;
    }

    // Xác thực token với Supabase Auth
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      this.logger.warn(`Token không hợp lệ: ${error?.message}`);
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
    }

    // Gắn thông tin user vào request để các controller sử dụng
    (request as any).user = data.user;
    (request as any).accessToken = token;
    return true;
  }
}
