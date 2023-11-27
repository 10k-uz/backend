import { Module } from '@nestjs/common';
import { FinAssetsService } from './fin-assets.service';
import { FinAssetsController } from './fin-assets.controller';
import { PrismaClient } from '@prisma/client';
import { PromotersService } from '../promoter/promoter.service';
import { AdminsService } from '../admin/admin.service';
import { RolesService } from '../roles/roles.service';

@Module({
  controllers: [FinAssetsController],
  providers: [
    FinAssetsService,
    PrismaClient,
    PromotersService,
    AdminsService,
    RolesService,
  ],
})
export class FinAssetsModule {}
