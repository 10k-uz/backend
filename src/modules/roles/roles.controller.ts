import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  Put,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dtos';
import { Request, Response } from 'express';
import { PermissionsService } from '../permissions/permissions.service';

import {
  createRole,
  deleteRoleById,
  getAllRoles,
  updateRole,
} from './handlers';
import { Perms } from 'src/decorators';
import { PermsGuard } from 'src/guards';

@Perms(['ALL'])
@UseGuards(PermsGuard)
@Controller('roles')
export class RolesController {
  constructor(
    private roleService: RolesService,
    private permService: PermissionsService,
  ) {}

  @Post()
  async create(@Body() data: CreateRoleDto, @Res() res: Response) {
    return await createRole(data, res, this.permService, this.roleService);
  }

  @Get()
  async getAll(@Res() res: Response, @Req() req: Request) {
    return await getAllRoles(res, this.roleService);
  }

  @Put(':roleId')
  async update(
    @Body() data: UpdateRoleDto,
    @Param('roleId') roleId: string,
    @Res() res: Response,
  ) {
    return await updateRole(data, roleId, res, this.roleService);
  }

  @Delete(':roleId')
  async delete(@Param('roleId') roleId: string, @Res() res: Response) {
    return await deleteRoleById(res, this.roleService, roleId);
  }
}
