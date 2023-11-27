import { UpdateTrStatusDto } from '../dto';
import { Response } from 'express';
import { TransactionsService } from '../transactions.service';
import { NotFoundException } from '@nestjs/common';
import { notFound } from 'src/utils';

export async function updateTrStatusHandler(
  transactionId: number,
  data: UpdateTrStatusDto,
  res: Response,
  transactionsService: TransactionsService,
) {
  let transaction = await transactionsService.findTransaction(transactionId);
  if (!transaction) {
    throw new NotFoundException({
      message: notFound('transaction', 'Id', String(transactionId)),
    });
  } else if (
    transaction.status === 'PAID' ||
    transaction.status === 'REJECTED'
  ) {
    throw new NotFoundException({
      message:
        "The operation has already been completed! You can't change the status of a request.",
    });
  }

  //update transaction status
  let updateStatus = await transactionsService.updateTrStatus(
    transactionId,
    data,
  );

  //send final success response
  res.json({
    message: `Transaction status with Id ${transactionId} is changed successfully!`,
    updatedAt: updateStatus.updatedAt,
    meta: {
      prev_status: transaction.status,
      current_status: updateStatus.status,
    },
  });
}
