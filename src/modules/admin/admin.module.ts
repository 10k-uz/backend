import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaClient } from '@prisma/client';
import { AdminsService } from './admin.service';
import { RolesService } from 'src/modules/roles/roles.service';
import { AuthAdminMiddleware } from 'src/middlewares';
import { PromotersService } from '../promoter/promoter.service';

@Module({
  controllers: [AdminController],
  providers: [AdminsService, PrismaClient, RolesService, PromotersService],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAdminMiddleware).forRoutes(
      {
        path: 'admin/getme',
        method: RequestMethod.GET,
      },
      {
        path: 'admin/list',
        method: RequestMethod.POST,
      },
    );
  }
}
