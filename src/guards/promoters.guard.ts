import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import { UserRequest } from 'src/interfaces';

@Injectable()
export class PromotersGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req: UserRequest = context.switchToHttp().getRequest();

    if (req.from === 'PROMOTER') {
      return true;
    }

    throw new ForbiddenException({
      message: `you don't have permission to create and read streams!`,
      role: UserType.PROMOTER,
    });
  }
}
