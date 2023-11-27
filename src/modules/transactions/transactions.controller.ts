import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Get,
  Query,
  Put,
  Param,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTrStatusDto } from './dto';
import { UserRequest } from 'src/interfaces';
import { Response } from 'express';
import { TransactionsGuard } from './transactions.guard';
import {
  getTrListByUserTypeHandler,
  sendWithdrawRequestHandler,
  updateTrStatusHandler,
} from './handlers';
import { PrismaClient, TrStatus } from '@prisma/client';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly prisma: PrismaClient,
  ) {}

  @Post('withdraw-request') // send request to withdraw
  @UseGuards(TransactionsGuard)
  async sendRequestToPay(
    @Body() data: CreateTransactionDto,
    @Req() req: UserRequest,
    @Res() res: Response,
  ) {
    return await sendWithdrawRequestHandler(
      data,
      req,
      res,
      this.transactionsService,
    );
  }

  @Get() // get transactions list by users
  async getTrListByUserType(
    @Req() req: UserRequest,
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: TrStatus,
    @Query('keyword') keyword: TrStatus,
  ) {
    return await getTrListByUserTypeHandler(
      req,
      res,
      this.transactionsService,
      {
        page,
        limit,
      },
      status,
      keyword,
    );
  }

  @Get('count') // get transactions list by users
  async getTrsCount(@Req() req: UserRequest, @Res() res: Response) {
    let newCount = await this.prisma.transactions.count({
      where: {
        status: 'NEW',
      },
    });

    res.json({
      message: 'here we go!',
      trs_count: {
        newCount,
      },
    });
  }

  @Put(':transactionId') //update transaction status
  async updateTrStatus(
    @Param('transactionId') transactionId: string,
    @Body() data: UpdateTrStatusDto,
    @Res() res: Response,
  ) {
    return await updateTrStatusHandler(
      +transactionId,
      data,
      res,
      this.transactionsService,
    );
  }
}
