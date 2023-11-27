import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaClient } from '@prisma/client';
import { PromotersService } from '../promoter/promoter.service';
import { AdminsService } from '../admin/admin.service';
import { RolesService } from '../roles/roles.service';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    PromotersService,
    PrismaClient,
    AdminsService,
    RolesService,
  ],
})
export class DashboardModule {}
