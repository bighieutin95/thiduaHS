import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/mock-login
   * Xác thực và đăng nhập dựa trên email & mật khẩu
   */
  @Post('mock-login')
  async mockLogin(
    @Body('account') account?: string,
    @Body('username') username?: string,
    @Body('email') email?: string,
    @Body('password') password?: string,
  ) {
    const loginAccount = account || username || email || '';
    return this.authService.mockLogin(loginAccount, password);
  }

  /**
   * GET /api/auth/profile
   * Lấy thông tin profile, vai trò hệ thống và vai trò thi đua của người dùng hiện tại.
   */
  @Get('profile')
  @UseGuards(SupabaseAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id, user.email);
  }
}
