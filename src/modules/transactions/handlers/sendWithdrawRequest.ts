import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRequest } from 'src/interfaces';
import { CreateTransactionDto } from '../dto';
import { TrStatus } from '@prisma/client';
import { Response } from 'express';
import { TransactionsService } from '../transactions.service';

export async function sendWithdrawRequestHandler(
  data: CreateTransactionDto,
  req: UserRequest,
  res: Response,
  transactionsService: TransactionsService,
) {
  /**
   *
   * @check_limit
   * -- Check User Balance for Withdrawal Request Eligibility
   * -- This function checks whether the user's balance is sufficient to initiate a withdrawal request.
   * -- The minimum balance required for a withdrawal request is currently set at 30,000 soums.
   *
   * Note: The minimum balance requirement is currently static,
   * but there are plans to make it dynamic in the future.
   *
   */
  let { id: user, balance: oldBalance } = await transactionsService.getBalance(
    req.user.info.id,
    req.user.userType,
  );

  // Note: id: user, here, I am checking user existability
  if (!user) {
    throw new BadRequestException(
      `${req.user.userType} is not found by ID ${req.user.info.id}`,
    );
  } else if (data.amount > oldBalance) {
    throw new BadRequestException({
      message: `Insufficient funds!`,
      current_balance: oldBalance,
      error: 'Bad request!',
    });
  }

  /**
   *
   * @send_payment_request
   * This function initiates the process of sending a payment request using service functions.
   *
   */
  let { requestId, current_balance, createdAt } =
    await transactionsService.updateBalance(
      req.user.info.id,
      data.amount,
      oldBalance,
      data.card_name,
      data.card_number,
    );

  /**
   *
   * @response
   * send final success response
   *
   */
  res.json({
    message: 'Request is sent to payment successfully!',
    info: {
      requestId,
      amount: data.amount,
      card_name: data.card_name,
      card_number: data.card_number,
      current_balance,
      status: TrStatus.NEW,
      createdAt,
    },
  });
}
