import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ChamDiemService } from './cham-diem.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('emulation')
@UseGuards(SupabaseAuthGuard)
export class ChamDiemController {
  constructor(private readonly chamDiemService: ChamDiemService) {}

  /** POST /api/emulation/grade - Ghi nhận điểm thi đua */
  @Post('grade')
  grade(@CurrentUser() user: any, @Body() body: any) {
    return this.chamDiemService.ghi(user.id, body);
  }

  /** GET /api/emulation/history - Xem lịch sử chấm điểm */
  @Get('history')
  history(@Query() query: any) {
    return this.chamDiemService.findHistory(query);
  }

  /** PUT /api/emulation/history/:id/cancel - Hủy đầu điểm sai */
  @Put('history/:id/cancel')
  cancel(@Param('id') id: string) {
    return this.chamDiemService.huyDiem(id);
  }
}
