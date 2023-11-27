import { PostRequest } from 'src/modules/posts/interfaces';
import { ViewsService } from '../views.service';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateViewDto } from '../dto';
import { StreamsService } from 'src/modules/streams/streams.service';
import { balanceAdder } from 'src/helpers';
import { UserType } from '@prisma/client';
import { AD_CAMPAIGN_BONUS } from 'src/constants';
import { notFound } from 'src/utils';
import { CaptchaData } from 'src/modules/captcha/interfaces';
import { captchaMap } from 'src/modules/captcha/captcha.controller';

/**
 * Handles the creation of a new view for a post.
 *
 * @param {PostRequest} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {ViewsService} viewsService - Service for managing views.
 * @param {string} Ip - The IP address of the viewer.
 * @param {CreateViewDto} data - Data for creating a new view.
 * @param {StreamsService} streamsService - Service for managing streams.
 */
export async function createViewHandler(
  req: PostRequest,
  res: Response,
  viewsService: ViewsService,
  data: CreateViewDto,
  streamsService: StreamsService,
) {
  const { Ip } = data;
  /**
   * Check if the viewer's IP address has already viewed the post.
   * If yes, respond with a 200 status code.
   */
  let viewerAlreadyExists = (await viewsService.findByIpAddress(Ip))
    .map((elem) => elem.postId)
    .includes(data.postId);

  if (viewerAlreadyExists) {
    return res.status(HttpStatus.OK).json({
      state: 'VIEW_NOT_CHANGED',
      message: `The view count remains the same as the user has already seen this post. Thanks for revisiting!`,
    });
  }

  // /**
  //  *
  //  * @check_captcha
  //  * checking captcha, is it has, verified and etc..
  //  *
  //  */
  // let verifiedCaptcha: CaptchaData = captchaMap.get('captcha');
  // if (
  //   !verifiedCaptcha ||
  //   verifiedCaptcha.Ip !== Ip ||
  //   !verifiedCaptcha.isVerified
  // ) {
  //   throw new BadRequestException({
  //     state: 'CAPTCHA_FAILED',
  //     message: `captcha is required and should be verified! `,
  //   });
  // }

  /**
   * Increment the view count for the post.
   */
  let updatedViewCount = req.post.views + 1;

  /**
   * Prepare data for creating a new view entry.
   */
  let viewData = {
    ...data,
    ip_address: Ip,
    views: updatedViewCount,
  };

  /**
   * If a stream ID is provided, award a bonus to the associated promoter.
   */
  if (data.streamId) {
    let stream = await streamsService.findById(data.streamId);
    if (!stream) {
      throw new NotFoundException(
        notFound('stream', 'ID', String(data.streamId)),
      );
    }

    if (!stream.promoterId) {
      throw new BadRequestException({
        message: `Promoter not found for the given streamId`,
      });
    } else if (stream.postId !== data.postId) {
      throw new BadRequestException({
        message: `postId and streamId do not match!`,
      });
    }

    // Award a bonus to the promoter's account.
    // await balanceAdder(UserType.PROMOTER, stream.promoterId, data.streamId);
  }

  /**
   * Create a new view entry for the post.
   */
  await viewsService.create(viewData);

  // Update viewers by associating the streamId with the post.
  await viewsService.updateByPostId(data.postId, data.streamId);

  /**
   * Send a success response.
   */
  res.json({
    state: 'VIEW_INCREASED',
    message: `A view has been added to the post`,
  });
}
