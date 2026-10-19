import { Controller, Get, Put, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PhanQuyenService } from './phan-quyen.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Controller('permissions')
@UseGuards(SupabaseAuthGuard)
export class PhanQuyenController {
  constructor(private readonly phanQuyenService: PhanQuyenService) {}

  /** GET /api/permissions/:classId - Lấy cấu hình phân quyền của lớp */
  @Get(':classId')
  findByLop(@Param('classId', ParseIntPipe) classId: number) {
    return this.phanQuyenService.findByLop(classId);
  }

  /** PUT /api/permissions/:classId - Cập nhật cấu hình phân quyền (Admin only) */
  @Put(':classId')
  update(@Param('classId', ParseIntPipe) classId: number, @Body() body: any[]) {
    return this.phanQuyenService.updateByLop(classId, body);
  }

  /** GET /api/permissions/users/all - Lấy danh sách toàn bộ người dùng */
  @Get('users/all')
  getAllUsers() {
    return this.phanQuyenService.getAllUsers();
  }

  /** PUT /api/permissions/update-user - Admin cấp username, mật khẩu và quyền */
  @Put('update-user')
  updateUser(@Body() body: any) {
    return this.phanQuyenService.updateUser(body);
  }

  /** PUT /api/permissions/update-password - Admin thay đổi mật khẩu tài khoản bất kỳ */
  @Put('update-password')
  updatePassword(@Body('email') email: string, @Body('password') matKhau: string) {
    return this.phanQuyenService.updatePassword(email, matKhau);
  }
}
