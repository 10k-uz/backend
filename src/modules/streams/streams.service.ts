import { Injectable } from '@nestjs/common';
import { CreateStreamDto } from './dto/stream.dto';
import { PrismaClient } from '@prisma/client';

interface CreateStreamType extends CreateStreamDto {
  promoterId: number;
}

@Injectable()
export class StreamsService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateStreamType) {
    let stream = await this.prisma.streams.create({
      data,
    });

    // creating defualt stream stats for this stream
    await this.prisma.streamStats.create({
      data: {
        streamId: stream.id,
        profit: 0,
        views: 0,
      },
    });

    return stream;
  }

  async findById(id: number) {
    return await this.prisma.streams.findUnique({
      where: {
        id,
      },
    });
  }

  async getByPromoterId(
    promoterId: number,
    page: number = 1,
    limit: number = 10,
    keyword?: string,
    categoryId?: string,
  ) {
    if (page == 0) {
      page = 1;
    }

    let startIndex = (page - 1) * limit;

    let streams = await this.prisma.streams.findMany({
      where: {
        promoterId,
        name: {
          contains: keyword,
          mode: 'insensitive',
        },
        post: {
          categoryId: categoryId !== 'undefined' ? +categoryId : undefined,
        },
      },
      skip: +startIndex,
      take: +limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    let total_pages = Math.ceil(
      (await this.prisma.streams.count({
        where: {
          promoterId,
        },
      })) / limit,
    );

    let total_length = await this.prisma.streams.count({
      where: {
        promoterId,
      },
    });

    let found_results = streams.length;

    return {
      meta: {
        current_page: +page,
        total_pages,
        total_length,
        found_results,
      },
      streams,
    };
  }

  async getByPagination(
    page: number = 1,
    limit: number = 10,
    keyword?: string,
    categoryId?: string,
  ) {
    if (page == 0) {
      page = 1;
    }

    let startIndex = (page - 1) * limit;

    let streams = await this.prisma.streams.findMany({
      where: {
        name: {
          contains: keyword,
          mode: 'insensitive',
        },
        post: {
          categoryId: categoryId !== 'undefined' ? +categoryId : undefined,
        },
      },
      skip: +startIndex,
      take: +limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        post: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    let total_pages = Math.ceil((await this.prisma.streams.count()) / limit);
    let total_length = await this.prisma.streams.count();
    let found_results = streams.length;

    return {
      meta: {
        current_page: +page,
        total_pages,
        total_length,
        found_results,
      },
      streams,
    };
  }

  async getStatsByPromoterId(
    promoterId: number,
    page: number = 1,
    limit: number = 10,
    keyword?: string,
  ) {
    if (page == 0) {
      page = 1;
    }

    let startIndex = (page - 1) * limit;

    let total_profit = await this.prisma.streamStats.aggregate({
      _sum: { profit: true },
      where: {
        stream: {
          promoterId,
        },
      },
    });

    let stats = await this.prisma.streamStats.findMany({
      where: {
        stream: {
          promoterId,
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      },
      select: {
        streamId: true,
        stream: {
          select: {
            name: true,
          },
        },
        views: true,
        profit: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: +startIndex,
      take: +limit,
    });

    return {
      total_pages: Math.ceil((await this.prisma.streamStats.count()) / limit),
      current_page: +page,
      limit: +limit,
      total_profit: total_profit._sum.profit,
      total_length: await this.prisma.streamStats.count({
        where: {
          stream: {
            promoterId,
          },
        },
      }),
      stats,
    };
  }

  async getStatsById(streamId: number) {
    let total_profit = await this.prisma.streamStats.aggregate({
      _sum: {
        profit: true,
      },
      where: {
        streamId,
      },
    });

    let streamStats = await this.prisma.streamStats.findMany({
      where: {
        streamId,
        views: {
          gt: 0,
        },
      },
    });

    return {
      total_profit: total_profit._sum.profit,
      streamStats,
    };
  }

  async deleteById(id: number) {
    return await this.prisma.streams.delete({
      where: {
        id,
      },
    });
  }
}
