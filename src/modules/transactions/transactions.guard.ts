import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import { UserRequest } from 'src/interfaces';

@Injectable()
export class TransactionsGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req: UserRequest = context.switchToHttp().getRequest();

    if (req.from === 'ADMIN') {
      throw new ForbiddenException({
        message: `only promoters can send request for now by this api url, your_role: ${UserType.ADMIN}`,
        error: 'Forbidden!',
      });
    }

    return true;
  }
}
