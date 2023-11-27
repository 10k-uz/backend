import { Response } from 'express';
import { PromoterRegisterDto } from '../../dto';
import { codeGenerator } from 'src/utils';
import { mailMap } from 'src/utils/mapSet';
import { codeSender } from 'src/helpers/code-sender';
import { BadRequestException } from '@nestjs/common';
import { MAIL_CODE_EXPIRE_TIME, MAIL_CODE_RESEND_TIME } from 'src/constants';

/**
 * @param res
 * @param data
 */
export async function resendCode(res: Response) {
  let userInfo: PromoterRegisterDto = mailMap.get('userInfo');

  // checking either they exists or not
  if (!userInfo || !userInfo.email) {
    throw new BadRequestException(`email is not found to send!`);
  }

  let generatedCode = codeGenerator();

  // sending an email
  await codeSender(userInfo.email, generatedCode);

  // generating verificationData object
  let currentDate = new Date();
  let verificationData = {
    code: generatedCode,
    createdAt: currentDate,
    expireTime: currentDate.getTime() + MAIL_CODE_EXPIRE_TIME * 1000,
    resendTime: currentDate.getTime() + MAIL_CODE_RESEND_TIME * 1000,
  };

  // deleting old info related to verificationData
  mailMap.delete('verificationData');

  // generating/seting verification object into map
  mailMap.set('verificationData', verificationData);

  // sending final success response
  res.json({
    message: 'Email has been re-sent successfully!',
  });
}
