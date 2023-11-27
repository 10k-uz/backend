import { Response } from 'express';
import { CreateAdminDto } from '../dto';
import { AdminsService } from '../admin.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { hash } from 'bcrypt';
import { hash_config } from 'src/configs';
import { RolesService } from 'src/modules/roles/roles.service';

/**
 * Creates a new admin user with the provided data.
 * @param data - The admin user data to be created.
 * @param res - The Express Response object for sending the response.
 * @param adminsService - The authentication service for admin users.
 * @param roleService - The service for managing roles.
 */
export async function createAdmin(
  data: CreateAdminDto,
  res: Response,
  adminsService: AdminsService,
  roleService: RolesService,
) {
  /**
   *
   * @ACCEPT_BODY_DATA
   * accepting data from req.body
   */
  let { username, password } = data;

  /**
   *
   * @CHECK_BY_USERNAME
   * find user in order to check if it exists, return exception with existed response
   *
   */
  let adminByUsername = await adminsService.findByUsername(username);

  /**
   *
   * @IF_NOT_FOUND
   * if admin is not found, we will throw the error that indicates not found response
   *
   */
  if (adminByUsername) {
    throw new HttpException(
      `admin with username ${username} is already existed!`,
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   *
   * @HASH_PASSWORD
   * here, we will hash the incame password for security reasons
   *
   */
  data.password = await hash(password, +hash_config.SALT_ROUNDS);

  /**
   *
   * @FIND_PERMISSIONS
   * find permissions of an admin in order to send it with jwt
   *
   */
  let role = await roleService.findById(data.roleId);
  if (!role) {
    throw new HttpException(
      `role is not found by roleId`,
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   *
   * @CREATE_ADMIN
   * if everything is ok, we will create an admin
   *
   */
  let admin = await adminsService.create(data);

  /**
   *
   * @RESPONSE
   * And finally, we will send the success response
   *
   */
  res.json({
    message: 'Admin is successfully created!',
    info: admin,
  });
}
