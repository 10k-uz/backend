import { Response } from 'express';
import { LoginAdminDto } from '../dto';
import { AdminsService } from '../admin.service';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { tokenGenerator } from 'src/utils/';
import { RolesService } from 'src/modules/roles/roles.service';
import { UserType } from '@prisma/client';

export async function loginAdmin(
  data: LoginAdminDto,
  res: Response,
  admisnService: AdminsService,
  roleService: RolesService,
) {
  /**
   *
   * @accept_body_data
   * accepting data from req.body
   */
  let { username, password } = data;

  /**
   *
   * @find_by_username
   * searching admin by username
   *
   */
  let adminByUsername = await admisnService.findByUsername(username);
  if (!adminByUsername) {
    throw new UnauthorizedException('username or password is incorrect!');
  }

  /**
   *
   * @check_by_password
   * now, we will check by password
   * not that: Password will be encrypted, that is why, we have to check by verifying
   *
   */
  let isPasswordTrue = await compare(password, adminByUsername.password);

  /**
   *
   *
   * @if_not_found || @if_pass_not_match
   * if admin is not found by username, we will throw 401 exception
   *
   */
  if (!isPasswordTrue) {
    throw new UnauthorizedException('username or password is incorrect!');
  }

  /**
   *
   * @find_permissions
   * find permissions of an admin in order to send it with jwt
   *
   */
  let role = await roleService.findById(adminByUsername.roleId);

  if (!role) {
    throw new HttpException(
      `role is not found by roleId`,
      HttpStatus.NOT_FOUND,
    );
  } else if (role.permissions.length === 0) {
    throw new HttpException(
      `there is no any permission in this role, it is an empty array`,
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   *
   * @generate_token
   * generate an access token for admin
   *
   */
  const payload = {
    info: adminByUsername,
    userType: UserType.ADMIN,
    permissions: role.permissions,
  };

  /**
   *
   * @generate_tokens
   * generate an access token for admin
   *
   */
  const { accessToken, refreshToken } = await tokenGenerator(payload);

  /**
   *
   * @response
   * if everything is ok, we will send final success response with access_token
   *
   */
  res.json({
    message: `Welcome back ${adminByUsername.name}`,
    ID: adminByUsername.id,
    accessToken,
    refreshToken,
  });
}
