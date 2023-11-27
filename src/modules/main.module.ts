import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { ImagesModule } from './images/images.module';
import { PostsModule } from './posts/posts.module';
import { StreamsModule } from './streams/streams.module';
import { ViewsModule } from './views/views.module';
import { CaptchaModule } from './captcha/captcha.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AdminModule } from './admin/admin.module';
import { PromoterModule } from './promoter/promoter.module';
import { AuthAdminMiddleware } from 'src/middlewares';
import { PrismaClient } from '@prisma/client';
import { AdminsService } from './admin/admin.service';
import { PromotersService } from './promoter/promoter.service';
import { FinAssetsModule } from './fin-assets/fin-assets.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PermissionsModule,
    RolesModule,
    CategoriesModule,
    ImagesModule,
    PostsModule,
    StreamsModule,
    ViewsModule,
    CaptchaModule,
    TransactionsModule,
    AdminModule,
    PromoterModule,
    FinAssetsModule,
    DashboardModule,
  ],
  providers: [PrismaClient, AdminsService, PromotersService],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthAdminMiddleware)
      .forRoutes(
        'roles',
        'permissions',
        'categories',
        'streams',
        'stats',
        'transactions',
        'fin-assets',
        'dashboard',
      );
  }
}
