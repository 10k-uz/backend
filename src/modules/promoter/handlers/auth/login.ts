import { Response } from 'express';
import { PromoterLoginDto } from '../../dto';
import { PromotersService } from '../../promoter.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { wrongCredentials } from 'src/utils';
import { compare } from 'bcrypt';
import { tokenGenerator } from 'src/utils';
import { UserType } from '@prisma/client';

/**
 *
 * @param res
 * @param data
 */
export async function promoterLogin(
  res: Response,
  data: PromoterLoginDto,
  promotersService: PromotersService,
) {
  /**
   *
   * @check_by_email
   * check by email, if exists, we have to throw exception indicates 400
   *
   */
  let isEmailMatch = await promotersService.findByEmail(data.email);
  if (!isEmailMatch) {
    throw new HttpException(wrongCredentials(), HttpStatus.UNAUTHORIZED);
  }

  /**
   *
   * @check_by_password
   * here, we have to check inout's password by the password saved in db
   *
   * ``NOTE: `` password will come from db as a hash, that is why, we should compare it
   *
   */
  let isPasswordMatch = await compare(data.password, isEmailMatch.password);
  if (!isPasswordMatch) {
    throw new HttpException(wrongCredentials(), HttpStatus.UNAUTHORIZED);
  }

  /**
   *
   * @give_permission
   * merging permissions to data
   *
   */
  let payload = {
    info: isEmailMatch,
    userType: UserType.PROMOTER,
    permissions: ['PROMOTER'],
  };

  /**
   *
   * @generate_tokens
   * here, we also have to generate access and refreshTokens
   *
   *
   * ``NOTE``
   * Now, we should generate tokens.
   *
   *
   */
  let { accessToken, refreshToken } = await tokenGenerator(payload);

  /**
   *
   * @response
   * if everything is ok, we can send final success respons ewith tokens!
   *
   */
  res.json({
    message: 'Successfully login!',
    accessToken,
    refreshToken,
  });
}
