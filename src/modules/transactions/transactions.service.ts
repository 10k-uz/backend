import { Injectable } from '@nestjs/common';
import { PrismaClient, TrStatus, UserType } from '@prisma/client';
import { UpdateTrStatusDto } from './dto';
import { transactionStatusEnum } from './interfaces';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaClient) {}

  async getBalance(userId: number, userType: UserType) {
    if (userType === 'PROMOTER') {
      return await this.prisma.promoters.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          balance: true,
        },
      });
    } else if (userType === 'ADMIN') {
      return await this.prisma.admins.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          balance: true,
        },
      });
    } else {
      return null;
    }
  }

  async updateBalance(
    userId: number,
    amount: number,
    oldBalance: number,
    card_name: string,
    card_number: string,
  ) {
    let updatePromoterBalance = await this.prisma.promoters.update({
      where: { id: userId },
      data: {
        balance: oldBalance - amount,
      },
    });
    let transactionRequest = await this.prisma.transactions.create({
      data: {
        amount,
        promoterId: userId,
        card_name,
        card_number,
      },
    });
    return {
      requestId: transactionRequest.id,
      current_balance: updatePromoterBalance.balance,
      createdAt: transactionRequest.createdAt,
    };
  }

  async getByUserType(
    userId: number,
    userType: UserType,
    page: number = 1,
    limit: number = 10,
    trStatus: TrStatus,
    keyword?: string,
  ) {
    if (page == 0) {
      page = 1;
    }

    let startIndex = (page - 1) * limit;
    if (userType === 'PROMOTER') {
      let transactionsByPromoter = await this.prisma.transactions.findMany({
        where: {
          promoterId: userId,
          status: trStatus ? trStatus : undefined,
        },
        select: {
          id: true,
          promoterId: true,
          amount: true,
          status: true,
          card_name: true,
          card_number: true,
          createdAt: true,
          updatedAt: true,
        },
        skip: +startIndex,
        take: +limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        meta: {
          current_page: +page,
          limit: +limit,
          total_pages: Math.ceil(
            (await this.prisma.transactions.count()) / +limit,
          ),
          total_length: Math.ceil(
            await this.prisma.transactions.count({
              where: {
                status: trStatus ? trStatus : undefined,
              },
            }),
          ),
          foundResults: transactionsByPromoter.length,
        },
        transactions: transactionsByPromoter,
      };
    } else if (userType === 'ADMIN') {
      let transactions = await this.prisma.transactions.findMany({
        select: {
          id: true,
          adminId: true,
          amount: true,
          status: true,
          card_name: true,
          card_number: true,
          createdAt: true,
          updatedAt: true,
        },
        skip: +startIndex,
        take: +limit,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          status: trStatus ? trStatus : undefined,
          OR: [
            {
              card_name: {
                contains: keyword ? keyword : '',
                mode: 'insensitive',
              },
            },
            {
              card_number: {
                contains: keyword ? keyword : '',
                mode: 'insensitive',
              },
            },
          ],
        },
      });

      return {
        meta: {
          current_page: +page,
          limit: +limit,
          total_pages: Math.ceil(
            (await this.prisma.transactions.count()) / +limit,
          ),
          total_length: Math.ceil(
            await this.prisma.transactions.count({
              where: {
                status: trStatus ? trStatus : undefined,
              },
            }),
          ),
          foundResults: transactions.length,
        },
        transactions,
      };
    }
  }

  async updateTrStatus(id: number, data: UpdateTrStatusDto) {
    return await this.prisma.transactions.update({
      where: {
        id,
      },
      data: {
        status: data.status,
        message: data.message,
      },
    });
  }

  async findTransaction(id: number) {
    return await this.prisma.transactions.findUnique({
      where: {
        id,
      },
    });
  }
}
