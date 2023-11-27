import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PrismaClient } from '@prisma/client';
import { PostsService } from '../posts/posts.service';

@Module({
  controllers: [ImagesController],
  providers: [PostsService, ImagesService, PrismaClient],
})
export class ImagesModule {}
