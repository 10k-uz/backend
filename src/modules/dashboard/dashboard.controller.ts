import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Response } from 'express';
import { Perms } from 'src/decorators';
import { PermsGuard } from 'src/guards';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Perms(['DASHBOARD', 'ADMIN'])
  @UseGuards(PermsGuard)
  async getDashboardStats(@Res() res: Response) {
    let stats = await this.dashboardService.getStats();

    res.json({
      message: 'Stats of dashboard!',
      stats,
    });
  }
}
