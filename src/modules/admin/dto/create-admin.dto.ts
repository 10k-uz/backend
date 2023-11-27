import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateAdminDto {
  @IsOptional()
  @IsNumber()
  adminId: number;

  @IsOptional()
  @IsNumber()
  roleId: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  password: string;
}
