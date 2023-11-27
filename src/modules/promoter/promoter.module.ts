import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PromotersService } from './promoter.service';
import { PromoterController } from './promoter.controller';
import { PrismaClient } from '@prisma/client';
import { AuthAdminMiddleware } from 'src/middlewares';
import { AdminsService } from '../admin/admin.service';

@Module({
  controllers: [PromoterController],
  providers: [PromotersService, PrismaClient, AdminsService],
})
export class PromoterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAdminMiddleware).forRoutes(
      {
        path: 'promoter/getme',
        method: RequestMethod.GET,
      },
      {
        path: 'promoter/update-info',
        method: RequestMethod.PATCH,
      },
    );
  }
}
