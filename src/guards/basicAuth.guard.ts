import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    let api_key = req.header('x-api-key');

    if (api_key !== process.env.API_KEY) {
      throw new ForbiddenException();
    }

    return true;
  }
}
