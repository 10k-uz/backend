import { Response } from 'express';
import { EmailVerificationDto, PromoterRegisterDto } from '../../dto';
import { PromotersService } from '../../promoter.service';
import { created, existed } from 'src/utils';
import { tokenGenerator } from 'src/utils';
import { UserType } from '@prisma/client';
import { mailMap } from 'src/utils/mapSet';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

export interface userInfoType extends EmailVerificationDto {
  createdAt: Date;
  expireTime: number;
  resendTime: number;
}

/**
 *
 * @param res
 * @param data
 */
export async function verifyEmail(
  res: Response,
  data: EmailVerificationDto,
  promotersService: PromotersService,
) {
  let userInfo: PromoterRegisterDto = mailMap.get('userInfo');
  let verificationData: userInfoType = mailMap.get('verificationData');

  if (!verificationData) {
    throw new NotFoundException(`verification code is not found`);
  }

  // check if it is expired
  let isExpired = new Date().getTime() >= verificationData.expireTime;
  if (isExpired) {
    throw new BadRequestException(
      `Expired Verification Code: This verification code has expired`,
    );
  } else if (verificationData.code !== data.code) {
    throw new BadRequestException(
      `Incorrect Verification Code: The code you entered is incorrect`,
    );
  }

  //checking user info
  if (!userInfo) {
    throw new BadRequestException(`userInfo is not found or incorrect!`);
  }

  // is email existed
  let isEmailExisted = await promotersService.findByEmail(userInfo.email);
  if (isEmailExisted) {
    throw new HttpException(
      existed('email', userInfo.email),
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   *
   * @register_adverter
   * now, we can register adverter
   *
   */
  let registerPromoter = await promotersService.register(userInfo);

  /**
   *
   * @give_permission
   * merging permissions to data
   *
   */
  let payload = {
    info: registerPromoter,
    userType: UserType.PROMOTER,
    permissions: ['ADVERTISER'],
  };

  /**
   *
   * @generate_tokens
   * here, we also have to generate access and refreshTokens
   *
   *
   * ``NOTE``
   * we should generate tokens when adverters register and login.
   * This is for avoiding re-login after regsitering
   *
   */
  let { accessToken, refreshToken } = await tokenGenerator(payload);
  /**
   *
   * @response
   * after all, we can send final success response to adverter with access and refresh tokens
   *
   */

  // clear stored data in the map (userInfo and verificationData)
  mailMap.delete('verificationData');
  mailMap.delete('userInfo');

  res.json({
    message: created('adverter', 'has', 'registered'),
    ID: registerPromoter.id,
    accessToken,
    refreshToken,
  });
}
