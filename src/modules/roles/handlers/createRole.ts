import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateRoleDto } from '../dtos';
import { Response } from 'express';
import { PermissionsService } from '../../permissions/permissions.service';
import { RolesService } from '../roles.service';

export async function createRole(
  data: CreateRoleDto,
  res: Response,
  permService: PermissionsService,
  roleService: RolesService,
) {
  /**
   *
   * @CheckByName
   * check by name
   *
   */

  let role = await roleService.findByName(data.name);
  if (role) {
    throw new HttpException(
      `role with name ${data.name} is already existed!`,
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   *
   * @FindById
   * find permission by ID
   */
  let findPermissions = await permService.getMultiple(data.permissions);
  if (findPermissions.length === 0) {
    return res.status(404).json({
      message: 'There is no any permissions with your request!',
    });
  }

  /**
   *
   * @FilterForMissedData
   * checking if there is missed data, make filter
   *
   */
  let missedData = data.permissions.filter(
    (name) => !findPermissions.map((elem) => elem.name).includes(name),
  );

  /**
   *
   * @MissedData
   * if we have missed datas, return missed data
   *
   */
  if (missedData.length !== 0) {
    return res.json({
      missed_perms: missedData,
    });
  }

  /**
   *
   * @CreateRole
   * if everything passed successfully, we will create a role
   *
   */
  let createRole = await roleService.create(data);

  /**
   *
   * @Response
   * Sending final success response to client
   *
   */
  res.json({
    message: 'Role is successfully created!',
    info: createRole,
  });
}
