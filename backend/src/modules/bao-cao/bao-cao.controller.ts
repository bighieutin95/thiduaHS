import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BaoCaoService } from './bao-cao.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Controller('emulation/reports')
@UseGuards(SupabaseAuthGuard)
export class BaoCaoController {
  constructor(private readonly baoCaoService: BaoCaoService) {}

  /** GET /api/emulation/reports/weekly?lop_id=&tuan_thu= */
  @Get('weekly')
  weekly(@Query('lop_id') lopId: string, @Query('tuan_thu') tuanThu: string) {
    return this.baoCaoService.baoTuanTheoLop(+lopId, +tuanThu);
  }

  /** GET /api/emulation/reports/monthly?lop_id=&thang=&nam= */
  @Get('monthly')
  monthly(@Query('lop_id') lopId: string, @Query('thang') thang: string, @Query('nam') nam: string) {
    return this.baoCaoService.baoThangTheoLop(+lopId, +thang, +nam);
  }
}
