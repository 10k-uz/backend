import { IsIP, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyCaptchaDto {
  @IsNotEmpty()
  @IsNumber()
  answer: number;

  @IsNotEmpty()
  @IsIP()
  Ip: string;
}

export class GenerateCaptchaDto {
  @IsNotEmpty()
  @IsIP()
  Ip: string;
}
