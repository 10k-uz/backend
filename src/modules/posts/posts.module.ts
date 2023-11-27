import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaClient } from '@prisma/client';
import { CategoriesService } from '../categories/categories.service';
import { StreamsService } from '../streams/streams.service';
import { AuthAdminMiddleware } from 'src/middlewares';
import { AdminsService } from '../admin/admin.service';
import { PromotersService } from '../promoter/promoter.service';
import { RolesService } from '../roles/roles.service';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    CategoriesService,
    StreamsService,
    PrismaClient,
    AdminsService,
    PromotersService,
    RolesService,
  ],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAdminMiddleware).forRoutes(
      {
        path: 'posts',
        method: RequestMethod.GET,
      },
      {
        path: 'posts',
        method: RequestMethod.POST,
      },
    );
  }
}
