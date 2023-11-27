import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateRoleDto } from '../dtos';
import { Response } from 'express';
import { RolesService } from '../roles.service';

export async function updateRole(
  data: UpdateRoleDto,
  roleId: string,
  res: Response,
  roleService: RolesService,
) {
  /**
   *
   * @FindRoleById
   * find a role by roleId in order to update
   *
   */
  let role = await roleService.findById(+roleId);

  /**
   *
   * @FindAndCheckByName
   * find a role by name in order to check, becuase it should be unique
   *
   */
  let checkByName = await roleService.findByName(data.name);

  /**
   *
   * @ConditionalChecking
   * start conditional checking by name and roleId
   *
   */
  if (!role) {
    throw new HttpException(
      {
        message: `role with ID ${roleId} is not found!`,
      },
      HttpStatus.NOT_FOUND,
    );
  } else if (checkByName) {
    throw new HttpException(
      {
        message: `role with name ${data.name} is already existed!`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   *
   * @UpdateRole
   * if everything ok, we will update the info of the role
   *
   */
  let updateRole = await roleService.update(+roleId, data);

  /**
   *
   * @Response
   * as always, we will send final success response
   *
   */
  res.json({
    message: 'role is updated successfully!',
    info: updateRole,
  });
}
