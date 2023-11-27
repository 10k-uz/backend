import { Injectable, CanActivate, BadRequestException } from '@nestjs/common';
import { userInfoType } from './handlers';
import { mailMap } from 'src/utils/mapSet';

@Injectable()
export class MailGuard implements CanActivate {
  async canActivate() {
    let verificationData: userInfoType = mailMap.get('verificationData');

    // check if it is existed
    if (verificationData) {
      let canResend = new Date().getTime() >= verificationData.resendTime;
      if (!canResend) {
        throw new BadRequestException(
          "You can't request a new code while the current code is still active",
        );
      }
    }

    return true;
  }
}
