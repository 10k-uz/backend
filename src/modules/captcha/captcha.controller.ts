import { Controller, Post, Body, Ip, Res, Get } from '@nestjs/common';
import { GenerateCaptchaDto, VerifyCaptchaDto } from './dto';
import { Response } from 'express';
import { generateCaptchaHandler, verifyCaptchaHandler } from './handlers';

export const captchaMap = new Map();

@Controller('captcha')
export class CaptchaController {
  @Post()
  async generateCaptcha(
    @Body() data: GenerateCaptchaDto,
    @Res() res: Response,
  ) {
    return await generateCaptchaHandler(data.Ip, res);
  }

  @Post('verify')
  async verifyCaptcha(@Body() data: VerifyCaptchaDto, @Res() res: Response) {
    return await verifyCaptchaHandler(data, res);
  }

  @Get('current')
  async getCurrentInfo(@Res() res: Response) {
    const data = captchaMap.get('captcha');
    res.json({
      data,
    });
  }
}
