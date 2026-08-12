import { Controller, Post, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { HocSinhService } from './hoc-sinh.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Controller('students')
@UseGuards(SupabaseAuthGuard)
export class HocSinhController {
  constructor(private readonly hocSinhService: HocSinhService) {}

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
