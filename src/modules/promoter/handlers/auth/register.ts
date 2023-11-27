import { Response } from 'express';
import { PromoterRegisterDto } from '../../dto';
import { PromotersService } from '../../promoter.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { codeGenerator, existed } from 'src/utils';
import { hash } from 'bcrypt';
import { hash_config } from 'src/configs';
import { MAIL_CODE_EXPIRE_TIME, MAIL_CODE_RESEND_TIME } from 'src/constants';
import { codeSender } from 'src/helpers/code-sender';
import { mailMap } from 'src/utils/mapSet';

/**
 *
 * @param res
 * @param data
 */
export async function promoterRegister(
  res: Response,
  data: PromoterRegisterDto,
  promotersService: PromotersService,
) {
  /**
   *
   * @check_by_email
   * check by email, if exists, we have to throw exception indicates 400
   *
   */
  let isEmailExisted = await promotersService.findByEmail(data.email);
  if (isEmailExisted) {
    throw new HttpException(
      existed('email', data.email),
      HttpStatus.BAD_REQUEST,
    );
  }

  let currentDate = new Date();

  let verificationData = {
    code: codeGenerator(),
    createdAt: currentDate,
    expireTime: currentDate.getTime() + MAIL_CODE_EXPIRE_TIME * 1000,
    resendTime: currentDate.getTime() + MAIL_CODE_RESEND_TIME * 1000,
  };

  // hashing user's password
  data.password = await hash(data.password, +hash_config.SALT_ROUNDS);

  // seting confirmObject and userInfo to map
  mailMap.set('verificationData', verificationData);
  mailMap.set('userInfo', data);

  /**
   *
   * @SEND_EMAIL
   * @SEND_OTP_CODE
   * sending OTP CODE to email come from payload
   *
   */
  await codeSender(data.email, verificationData.code);

  /**
   *
   * @RESPONSE
   * sending final success response
   *
   */
  res.json({
    message: 'Confirmation code is sent to your email!',
  });
}
