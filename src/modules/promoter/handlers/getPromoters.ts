import { Response } from 'express';
import { PromotersService } from '../promoter.service';
import { paginationData } from 'src/interfaces';

export async function getPromotersHandler(
  res: Response,
  data: paginationData,
  promotersService: PromotersService,
) {
  // get promoters list
  let promoters = await promotersService.getPromoters(data);

  // send final success response
  res.json({
    message: 'Promoters info',
    ...promoters,
  });
}
