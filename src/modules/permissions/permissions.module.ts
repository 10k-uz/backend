import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { PrismaClient } from '@prisma/client';
import { PromotersService } from '../promoter/promoter.service';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PromotersService, PrismaClient],
})
export class PermissionsModule {}
