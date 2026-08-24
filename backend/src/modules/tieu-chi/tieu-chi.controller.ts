import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { TieuChiService } from './tieu-chi.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Controller('criteria')
@UseGuards(SupabaseAuthGuard)
export class TieuChiController {
  constructor(private readonly tieuChiService: TieuChiService) {}

  /** GET /api/criteria - Lấy danh sách tiêu chí thi đua */
  @Get()
  findAll(@Query('showAll') showAll?: string) {
    return this.tieuChiService.findAll(showAll === 'true');
  }

  /** POST /api/criteria - Tạo mới tiêu chí */
  @Post()
  create(@Body() body: any) {
    return this.tieuChiService.create(body);
  }

  /** PUT /api/criteria/:id - Cập nhật tiêu chí */
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.tieuChiService.update(id, body);
  }

  /** DELETE /api/criteria/:id - Xóa mềm tiêu chí */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tieuChiService.remove(id);
  }
}
