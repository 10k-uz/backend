import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaClient) {}

  async getStats() {
    const posts = await this.prisma.posts.count();
    const streams = await this.prisma.streams.count();
    const promoters = await this.prisma.promoters.count();
    const admins = await this.prisma.admins.count();
    const payments = await this.prisma.transactions.count();
    const categories = await this.prisma.categories.count();
    const views = await this.prisma.posts.aggregate({
      _sum: {
        views: true,
      },
    });

    return {
      posts,
      categories,
      streams,
      promoters,
      admins,
      payments,
      views: views._sum.views,
    };
  }
}
