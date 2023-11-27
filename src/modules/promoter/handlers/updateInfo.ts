import { Response } from 'express';
import { PromotersService } from '../promoter.service';
import { UserRequest } from 'src/interfaces';
import { UpdateInfoDto } from '../dto/updateInfo.dto';
import { updated } from 'src/utils';

/**
 *
 * @param res
 * @param data
 */
export async function updateInfoHandler(
  data: UpdateInfoDto,
  req: UserRequest,
  res: Response,
  promotersService: PromotersService,
) {
  // updating promoter info
  await promotersService.updateInfo(req.user.info.id, data);

  res.json({
    message: updated('info', 'promoterId', `${req.user.info.id}`),
  });
}
