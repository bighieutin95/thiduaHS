import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/mock-login
   * Lấy token giả lập dựa trên email
   */
  @Post('mock-login')
  async mockLogin(@Body('email') email: string) {
    return this.authService.mockLogin(email);
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
