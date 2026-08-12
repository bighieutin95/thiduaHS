import { Controller, Get, Post, Put, Delete, Patch, Param, Body, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { HocSinhService } from './hoc-sinh.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Controller('students')
@UseGuards(SupabaseAuthGuard)
export class HocSinhController {
  constructor(private readonly hocSinhService: HocSinhService) {}

  /** GET /api/students?lop_id=1 - Lấy danh sách học sinh theo lớp */
  @Get()
  findByLop(@Query('lop_id', ParseIntPipe) lopId: number) {
    return this.hocSinhService.findByLop(lopId);
  }

  /** POST /api/students - Tạo học sinh mới */
  @Post()
  create(@Body() body: any) {
    return this.hocSinhService.create(body);
  }

  /** PUT /api/students/:id - Cập nhật học sinh */
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.hocSinhService.update(id, body);
  }

  /** DELETE /api/students/:id - Xóa học sinh */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hocSinhService.remove(id);
  }

  /** POST /api/students/import - Import danh sách học sinh */
  @Post('import')
  importList(@Body() body: { lop_id: number; hoc_sinh_list: any[] }) {
    return this.hocSinhService.importList(body.lop_id, body.hoc_sinh_list);
  }

  /** PATCH /api/students/:id/role - Cập nhật vai trò thi đua */
  @Patch(':id/role')
  updateRole(@Param('id', ParseIntPipe) id: number, @Body('vai_tro_thi_dua') vaiTro: any) {
    return this.hocSinhService.updateVaiTro(id, vaiTro);
  }
}
