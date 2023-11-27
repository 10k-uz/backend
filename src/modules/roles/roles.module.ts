import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaClient } from '@prisma/client';
import { PermissionsService } from '../permissions/permissions.service';
import { PromotersService } from '../promoter/promoter.service';
import { AdminsService } from '../admin/admin.service';

@Module({
  controllers: [RolesController],
  providers: [
    RolesService,
    PromotersService,
    PrismaClient,
    PermissionsService,
    AdminsService,
    RolesService,
  ],
})
export class RolesModule {}
