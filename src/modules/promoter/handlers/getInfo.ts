import { Response } from 'express';
import { PromotersService } from '../promoter.service';
import { UserRequest } from 'src/interfaces';
import { info, notFound } from 'src/utils';
import { NotFoundException } from '@nestjs/common';

/**
 *
 * @param res
 * @param data
 */
export async function getPromoterInfoHandler(
  req: UserRequest,
  res: Response,
  promotersService: PromotersService,
) {
  /**
   *
   * @get_info
   * get promoter info by ID
   *
   */
  let promoterInfo = await promotersService.getPromoterInfo(req.user.info.id);
  if (!promoterInfo) {
    throw new NotFoundException(
      notFound('promter', 'ID', String(req.user.info.id)),
    );
  }

  let {
    info: {
      id,
      first_name,
      last_name,
      email,
      balance,
      createdAt,
      updatedAt,
      _count: { streams, transactions },
    },
    streamViews,
    total_paid,
  } = promoterInfo;

  res.json({
    message: info('promoter', 'ID', String(req.user.info.id)),
    info: {
      id,
      first_name,
      last_name,
      email,
      createdAt,
      updatedAt,
    },
    stats: {
      balance,
      streams,
      transactions,
      streamViews,
      total_paid,
    },
  });
}
