import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class PromoterRegisterDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  password: string;
}
