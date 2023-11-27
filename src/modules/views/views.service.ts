import { Injectable } from '@nestjs/common';
import { CreateViewDto } from './dto/view.dto';
import { PrismaClient } from '@prisma/client';
import { PostsService } from '../posts/posts.service';

interface CreateViewType extends CreateViewDto {
  ip_address: string;
  views: number;
}

@Injectable()
export class ViewsService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly postsService: PostsService,
  ) {}

  async create(data: CreateViewType) {
    await this.postsService.updateView(data.postId, data.views);

    return await this.prisma.viewers.create({
      data: {
        postId: data.postId,
        ip_address: data.ip_address,
      },
    });
  }

  async findByIpAddress(ip_address: string) {
    return await this.prisma.viewers.findMany({
      where: {
        ip_address,
      },
    });
  }

  async updateByPostId(postId: number, streamId: number) {
    return await this.prisma.viewers.updateMany({
      where: {
        postId,
      },
      data: {
        streamId,
      },
    });
  }
}
