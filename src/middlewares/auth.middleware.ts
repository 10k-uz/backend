import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tokenFormatter } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/configs';
import { DecodedUserToken } from 'src/interfaces';
import { AdminsService } from '../modules/admin/admin.service';
import { PromotersService } from '../modules/promoter/promoter.service';

const jwtService = new JwtService();

@Injectable()
export class AuthAdminMiddleware implements NestMiddleware {
  constructor(
    private adminsService: AdminsService,
    private promotersService: PromotersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let token = tokenFormatter(req.header('authorization'));

    if (!token) {
      throw new UnauthorizedException(`Token is not provided! UNAUTHORIZED!`);
    }

    try {
      const payload: DecodedUserToken = await jwtService.verifyAsync(token, {
        secret: jwt_config.access_secret,
      });

      if (payload.userType === 'ADMIN') {
        let admin = await this.adminsService.findById(payload.info.id);
        if (!admin) {
          throw new NotFoundException(
            `admin is not found with ID ${payload.info.id}`,
          );
        }

        req['from'] = 'ADMIN';
      } else if (payload.userType === 'PROMOTER') {
        let promoter = await this.promotersService.findById(payload.info.id);
        if (!promoter) {
          throw new NotFoundException(
            `promoter is not found with ID ${payload.info.id}`,
          );
        }

        req['from'] = 'PROMOTER';
      } else {
        throw new UnauthorizedException();
      }

      req['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }

    return next();
  }
}
