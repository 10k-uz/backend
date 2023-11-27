import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Query,
} from '@nestjs/common';
import { AdminsService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import {
  createAdmin,
  getAdminInfoHandler,
  getAdminsHandler,
  loginAdmin,
} from './handlers';
import { Response } from 'express';
import { LoginAdminDto } from './dto';
import { RolesService } from 'src/modules/roles/roles.service';
import { UserRequest } from 'src/interfaces';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminsService: AdminsService,
    private roleService: RolesService,
  ) {}

  @Post('register')
  async create(@Body() createAuthDto: CreateAdminDto, @Res() res: Response) {
    return await createAdmin(
      createAuthDto,
      res,
      this.adminsService,
      this.roleService,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginAdminDto, @Res() res: Response) {
    return await loginAdmin(data, res, this.adminsService, this.roleService);
  }

  @Get('getme')
  async getInfo(@Res() res: Response, @Req() req: UserRequest) {
    return await getAdminInfoHandler(
      res,
      req,
      this.adminsService,
      this.roleService,
    );
  }

  @Get('list')
  async getAdminsList(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('keyword') keyword: string,
    @Res() res: Response,
    @Req() req: UserRequest,
  ) {
    return await getAdminsHandler(
      { page, limit, keyword },
      res,
      this.adminsService,
    );
  }
}
