import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LopService } from './lop.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Controller('classes')
@UseGuards(SupabaseAuthGuard)
export class LopController {
  constructor(private readonly lopService: LopService) {}

  /** GET /api/classes - Lấy danh sách tất cả lớp học */
  @Get()
  findAll() {
    return this.lopService.findAll();
  }

  /** GET /api/classes/:classId/students - Lấy danh sách học sinh theo lớp */
  @Get(':classId/students')
  findStudents(@Param('classId', ParseIntPipe) classId: number) {
    return this.lopService.findStudentsByClass(classId);
  }

  /** POST /api/classes - Tạo lớp mới (Admin only) */
  @Post()
  create(@Body() body: any) {
    return this.lopService.create(body);
  }

  /** PUT /api/classes/:id - Cập nhật lớp học (Admin only) */
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.lopService.update(id, body);
  }

  /** DELETE /api/classes/:id - Xóa lớp học (Admin only) */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lopService.remove(id);
  }
}
