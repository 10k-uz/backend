import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaClient } from '@prisma/client';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PromotersService } from '../promoter/promoter.service';
import { AdminsService } from '../admin/admin.service';
import { RolesService } from '../roles/roles.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    PromotersService,
    PrismaClient,
    AdminsService,
    RolesService,
  ],
  imports: [NestjsFormDataModule],
})
export class CategoriesModule {}
