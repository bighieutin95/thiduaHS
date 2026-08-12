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
}
