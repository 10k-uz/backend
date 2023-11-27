import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EmailVerificationDto {
  @IsNumber()
  @IsNotEmpty()
  code: string;
}
