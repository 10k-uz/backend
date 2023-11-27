import { Response } from 'express';
import { AdminsService } from '../admin.service';
import { NotFoundException } from '@nestjs/common';
import { info, notFound } from 'src/utils/';
import { UserRequest } from 'src/interfaces';
import { RolesService } from 'src/modules/roles/roles.service';

/**
 * Handle the request to retrieve streams by promoterId.
 *
 * @param req - The HTTP request object containing promoter information.
 * @param res - The HTTP response object to send the response.
 * @param adminsService - An instance of the AdminsService class for database operations.
 */
export async function getAdminInfoHandler(
  res: Response,
  req: UserRequest,
  adminsService: AdminsService,
  rolesService: RolesService,
) {
  /**
   * @find_admin
   * find admin by Id
   */
  let adminInfo = await adminsService.findById(req.user.info.id);

  //if not found
  if (!adminInfo) {
    throw new NotFoundException(
      notFound('user', 'Id', String(req.user.info.id)),
    );
  }

  // get permissions of the admin
  let { permissions } = await rolesService.findById(adminInfo.roleId);

  /**
   * @response
   * if everything is ok, send final success response with data
   */
  res.json({
    message: info('admin', 'Id', String(req.user.info.id)),
    info: {
      ...adminInfo,
      permissions,
    },
  });
}
