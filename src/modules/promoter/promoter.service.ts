import { Injectable } from '@nestjs/common';
import { PromoterRegisterDto } from './dto/register.dto';
import { PrismaClient } from '@prisma/client';
import { UpdateInfoDto } from './dto/updateInfo.dto';
import { paginationData } from 'src/interfaces';

@Injectable()
export class PromotersService {
  constructor(private readonly prisma: PrismaClient) {}

  async register(data: PromoterRegisterDto) {
    return await this.prisma.promoters.create({
      data,
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.promoters.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.promoters.findUnique({
      where: {
        id,
      },
    });
  }

  async getPromoterInfo(promoterId: number) {
    let streamViews = await this.prisma.streamStats.aggregate({
      where: {
        stream: {
          promoterId,
        },
      },
      _sum: {
        views: true,
      },
    });

    let total_paid = await this.prisma.transactions.aggregate({
      where: {
        status: 'PAID',
        promoterId,
      },
      _sum: {
        amount: true,
      },
    });

    let info = await this.prisma.promoters.findUnique({
      where: {
        id: promoterId,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            streams: true,
            transactions: true,
          },
        },
      },
    });

    return {
      streamViews: streamViews._sum.views,
      total_paid: total_paid._sum.amount,
      info,
    };
  }

  async getPromoters(data: paginationData) {
    const { page = 1, limit = 10, keyword } = data;
    const startIndex = Math.max(+page - 1, 0) * +limit;

    let promoters = await this.prisma.promoters.findMany({
      where: {
        OR: [
          {
            first_name: {
              contains: keyword ? String(keyword) : '',
              mode: 'insensitive',
            },
          },
          {
            last_name: {
              contains: keyword ? String(keyword) : '',
              mode: 'insensitive',
            },
          },
          {
            id: /^[0-9]+$/.test(keyword) ? +keyword : undefined,
          },
          {
            email: {
              contains: keyword ? String(keyword) : '',
            },
          },
        ],
      },
      skip: startIndex,
      take: +limit,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
        _count: true,
      },
    });

    return {
      meta: {
        current_page: +page,
        limit: +limit,
        total_pages: Math.ceil((await this.prisma.promoters.count()) / +limit),
        total_length: Math.ceil(await this.prisma.promoters.count()),
        foundResults: promoters.length,
      },
      promoters,
    };
  }

  async promotersCount() {
    return this.prisma.promoters.count();
  }

  async updateInfo(promoterId: number, data: UpdateInfoDto) {
    return this.prisma.promoters.update({
      where: {
        id: promoterId,
      },
      data,
    });
  }
}
