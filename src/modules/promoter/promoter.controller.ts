import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  HttpCode,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { PromotersService } from './promoter.service';
import { Response } from 'express';

import {
  PromoterRegisterDto,
  EmailVerificationDto,
  PromoterLoginDto,
} from './dto';

import {
  verifyEmail,
  getPromoterInfoHandler,
  promoterLogin,
  promoterRegister,
  resendCode,
  updateInfoHandler,
  getPromotersHandler,
} from './handlers';
import { UserRequest } from 'src/interfaces';
import { MailGuard } from './promoter.guard';
import { UpdateInfoDto } from './dto/updateInfo.dto';

@Controller('promoter')
export class PromoterController {
  constructor(private readonly promotersService: PromotersService) {}

  @Post('auth/register')
  // @UseGuards(MailGuard)
  async register(@Body() data: PromoterRegisterDto, @Res() res: Response) {
    return await promoterRegister(res, data, this.promotersService);
  }

  @Post('auth/login')
  @HttpCode(200)
  async login(@Body() data: PromoterLoginDto, @Res() res: Response) {
    return await promoterLogin(res, data, this.promotersService);
  }

  @Post('auth/verify')
  @HttpCode(200)
  async verifyEmail(@Body() data: EmailVerificationDto, @Res() res: Response) {
    return await verifyEmail(res, data, this.promotersService);
  }

  @Post('auth/resend')
  @UseGuards(MailGuard)
  @HttpCode(200)
  async resendCode(@Res() res: Response) {
    return await resendCode(res);
  }

  @Get('getme')
  async getPromoterInfo(@Req() req: UserRequest, @Res() res: Response) {
    return await getPromoterInfoHandler(req, res, this.promotersService);
  }

  @Patch('update-info')
  async updateInfo(
    @Req() req: UserRequest,
    @Body() data: UpdateInfoDto,
    @Res() res: Response,
  ) {
    return await updateInfoHandler(data, req, res, this.promotersService);
  }

  // Controllers realted to ADMIN PANEL

  @Get('list')
  async getPromoters(
    @Res() res: Response,
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await getPromotersHandler(
      res,
      {
        page,
        limit,
        keyword,
      },
      this.promotersService,
    );
  }
}
