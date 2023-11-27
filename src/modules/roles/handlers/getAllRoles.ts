import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RolesService } from '../roles.service';

export async function getAllRoles(res: Response, roleService: RolesService) {
  /**
   *
   * @FetchAll
   * fetching all roles from db by role's service
   *
   */
  let all_roles = await roleService.getAll();

  /**
   *
   * @ConditionalChecking
   * conditional checking if there is no any data in the roles array and sending exception
   *
   */
  if (all_roles.length === 0) {
    throw new HttpException(
      'There is no any role to display!',
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   *
   * @Response
   * sending final response with all roles
   *
   */
  res.json({
    message: 'Here we go!',
    roles: all_roles,
  });
}
