import { info } from 'src/utils';
import { Response } from 'express';
import { UserRequest, paginationData } from 'src/interfaces';
import { TransactionsService } from '../transactions.service';
import { PrismaClient, TrStatus } from '@prisma/client';

export async function getTrListByUserTypeHandler(
  req: UserRequest,
  res: Response,
  transactionsService: TransactionsService,
  queryParams: paginationData,
  status: TrStatus,
  keyword?: string,
) {
  /**
   *
   * @get_transactions
   * @get_by_user
   *
   * get transactions list by userId
   * userId comes from request and users type will be either ADMIN or PROMOTER
   *
   */
  let transactions = await transactionsService.getByUserType(
    req.user.info.id,
    req.user.userType,
    queryParams.page,
    queryParams.limit,
    status,
    keyword,
  );

  /**
   *
   * @response
   * send final success response
   *
   */
  res.json({
    message:
      req.user.userType === 'PROMOTER'
        ? info(
            'transactions',
            `${req.user.userType.toLowerCase()}Id`,
            String(req.user.info.id),
          )
        : 'Transactions list',
    user_role: req.user.userType,
    ...transactions,
  });
}
