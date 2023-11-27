import { Module } from '@nestjs/common';
import { StreamsService } from './streams.service';
import { StreamsController } from './streams.controller';
import { PrismaClient } from '@prisma/client';
import { PostsService } from '../posts/posts.service';
import { CategoriesService } from '../categories/categories.service';
import { FinAssetsService } from '../fin-assets/fin-assets.service';

@Module({
  controllers: [StreamsController],
  providers: [
    StreamsService,
    PostsService,
    PrismaClient,
    CategoriesService,
    FinAssetsService,
  ],
  exports: [StreamsService],
})
export class StreamsModule {}
