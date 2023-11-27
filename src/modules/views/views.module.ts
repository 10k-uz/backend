import { Module } from '@nestjs/common';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';
import { PrismaClient } from '@prisma/client';
import { PostsService } from '../posts/posts.service';
import { StreamsService } from '../streams/streams.service';
import { CategoriesService } from '../categories/categories.service';
import { FinAssetsService } from '../fin-assets/fin-assets.service';

@Module({
  controllers: [ViewsController],
  providers: [
    ViewsService,
    PrismaClient,
    PostsService,
    StreamsService,
    CategoriesService,
    FinAssetsService,
  ],
})
export class ViewsModule {}
