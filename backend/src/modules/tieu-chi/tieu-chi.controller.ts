import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TieuChiService } from './tieu-chi.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Controller('criteria')
@UseGuards(SupabaseAuthGuard)
export class TieuChiController {
  constructor(private readonly tieuChiService: TieuChiService) {}

  /** GET /api/criteria - Lấy danh sách tiêu chí thi đua */
  @Get()
  findAll() {
    return this.tieuChiService.findAll();
  }

  /** POST /api/criteria - Tạo mới tiêu chí (Admin only) */
  @Post()
  create(@Body() body: any) {
    return this.tieuChiService.create(body);
  }
}
