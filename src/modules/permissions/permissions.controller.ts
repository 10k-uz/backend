import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermDto } from './dtos';
import { Response } from 'express';
import { PermsGuard } from 'src/guards';

@Controller('permissions')
export class PermissionsController {
  constructor(private permService: PermissionsService) {}

  @Post()
  async create(@Body() data: CreatePermDto, @Res() res: Response) {
    let { name } = data;

    //check a name if it exists
    let permName = await this.permService.findByName(name);
    if (permName) {
      throw new HttpException(
        `permission with name ${name} is already existed!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // creating permission
    let permission = await this.permService.create(data);

    // sending final response
    res.json({
      message: 'Permission successfully created!',
      info: permission,
    });
  }

  @Get()
  async getAll(@Res() res: Response) {
    let all_perms = await this.permService.getAll();

    if (all_perms.length === 0) {
      throw new HttpException(
        'There is no any permission to display!',
        HttpStatus.NOT_FOUND,
      );
    }

    res.json({
      message: 'Here we go!',
      permissions: all_perms,
    });
  }

  @Put(':permId')
  async update(
    @Body() data: CreatePermDto,
    @Param('permId') permId: string,
    @Res() res: Response,
  ) {
    // find a permission to update
    let permission = await this.permService.findById(+permId);
    let checkByName = await this.permService.findByName(data.name);
    if (!permission) {
      throw new HttpException(
        {
          message: `permission with ID ${permId} is not found!`,
        },
        HttpStatus.NOT_FOUND,
      );
    } else if (checkByName) {
      throw new HttpException(
        {
          message: `permission with name ${data.name} is already existed!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // update perm info
    let updatePerm = await this.permService.update(+permId, data);

    // sending final response
    res.json({
      message: 'Permission is updated successfully!',
      info: updatePerm,
    });
  }

  @Delete(':permId')
  async delete(@Param('permId') permId: string, @Res() res: Response) {
    // find permission
    let permission = await this.permService.findById(+permId);
    if (!permission) {
      throw new HttpException(
        `permission with ID ${permId} is not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    // delete permission
    await this.permService.delete(+permId);

    // send final success response
    res.json({
      message: `permission with ID ${permId} is deleted successfully!`,
    });
  }
}
