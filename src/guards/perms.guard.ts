import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRequest } from 'src/interfaces';
import { AdminsService } from 'src/modules/admin/admin.service';
import { PromotersService } from 'src/modules/promoter/promoter.service';
import { RolesService } from 'src/modules/roles/roles.service';
import { notFound } from 'src/utils';

@Injectable()
export class PermsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly promoterService: PromotersService,
    private readonly adminsService: AdminsService,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: UserRequest = context.switchToHttp().getRequest();
    const perms = this.reflector.get('perms', context.getHandler());

    if (req.from === 'PROMOTER') {
      let promoter = await this.promoterService.findById(req.user.info.id);
      if (!promoter) {
        throw new NotFoundException(notFound('promoter', 'token', ''));
      }

      throw new ForbiddenException({
        message: `you don't have permission here!`,
        your_role: 'PROMOTER',
        required_role: 'ADMIN',
      });
    } else if (req.from === 'ADMIN') {
      // find an admin
      let admin = await this.adminsService.findById(req.user.info.id);
      if (!admin) {
        throw new NotFoundException(
          notFound('promoter', 'id', req.user.info.id),
        );
      }

      // get permissions
      let adminRoleInfo = await this.rolesService.findById(admin.roleId);
      if (!adminRoleInfo) {
        throw new NotFoundException(notFound('role', 'id', admin.roleId));
      }

      // check for CEO or Founder
      if (adminRoleInfo.permissions.includes('ALL')) {
        return true;
      }

      const hasAccess = adminRoleInfo.permissions
        .map((adminPerm) => adminPerm.toUpperCase())
        .some((adminPerm) => perms.includes(adminPerm.toUpperCase()));

      if (!hasAccess) {
        throw new ForbiddenException();
      }

      return true;
    } else {
      throw new ForbiddenException();
    }
  }
}
