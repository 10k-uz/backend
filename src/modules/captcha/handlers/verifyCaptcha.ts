import { BadRequestException } from '@nestjs/common';
import { captchaMap } from '../captcha.controller';
import { CaptchaData } from '../interfaces';
import { captchaExpireDate } from 'src/configs';
import { Response } from 'express';
import { VerifyCaptchaDto } from '../dto';

export async function verifyCaptchaHandler(
  data: VerifyCaptchaDto,
  res: Response,
) {
  const { Ip } = data;
  /**
   *
   * @get_captcha
   * first, we have to get captcha from Map in order to check
   *
   */

  let captchaInfo: CaptchaData = captchaMap.get('captcha');

  /***
   *
   * @check_info
   * @doesExist
   *
   * here, we have to check for every evidence,
   * becuase if server shuts down, all info in the map will be deleted!
   *
   */
  if (!captchaInfo) {
    throw new BadRequestException({
      message: `Captcha is not found!`,
    });
  } else if (captchaInfo.Ip !== Ip) {
    throw new BadRequestException({
      message: `IP does not match`,
    });
  }

  /**
   *
   * @check_expire_state
   * here, we have to check a user with this IP, already solve it or verifyId is is not expired yet
   *
   */
  let verifiedCaptchaInfo: CaptchaData = captchaMap.get('captcha');
  if (verifiedCaptchaInfo) {
    if (verifiedCaptchaInfo.expireIn < new Date()) {
      // delete expired captcha
      captchaMap.delete('captcha');

      // throw an error response indicates 400
      throw new BadRequestException({
        message: 'captcha is expired!',
      });
    } else if (verifiedCaptchaInfo.isVerified) {
      throw new BadRequestException({
        message: 'captcha is already verified with this IP',
      });
    }
  }

  /**
   *
   * @doesItCorrect
   * if it is correct we generate an verifcationId and send
   * if not, we will reject user info and do not let!
   *
   */
  if (data.answer !== captchaInfo.answer) {
    throw new BadRequestException({
      isCorrect: false,
      message: `Math calculation is wrong!`,
    });
  }

  /**
   *
   * @delete_old_captchaInfo
   * delete old captcha info from Map storage
   *
   */
  captchaMap.delete('captcha');

  /**
   *
   * @save_new_info
   * saving new info to map with ``verificationId``
   *
   */

  let newData: CaptchaData = {
    Ip: captchaInfo.Ip,
    answer: captchaInfo.answer,
    math_problem: captchaInfo.math_problem,
    isVerified: true,
    createdAt: new Date(),
    expireIn: new Date(new Date().getTime() + captchaExpireDate),
  };

  // set values
  captchaMap.set('captcha', newData);

  /**
   *
   * @response
   * sending final response with verificationId
   *
   */
  res.json({
    isVerified: true,
    message: `captcha is verified successfully!`,
  });
}
