import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PromoterLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
