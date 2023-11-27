import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RolesService } from '../roles.service';

export async function deleteRoleById(
  res: Response,
  roleService: RolesService,
  roleId: string,
) {
  /**
   *
   * @FindRole
   * find a role in order to delete by roleId
   *
   */
  let role = await roleService.findById(+roleId);

  /**
   *
   * @IfNotFound
   * if role is not found, we will send not found message by HttpException
   *
   */
  if (!role) {
    throw new HttpException(
      `role with ID ${roleId} is not found!`,
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   *
   * @Delete
   * If everything is ok, we will delete the role by roleId
   */
  await roleService.delete(+roleId);

  /**
   *
   * @Response
   * after that, we will send final success response
   *
   */
  res.json({
    message: `role with ID ${roleId} is deleted successfully!`,
  });
}
