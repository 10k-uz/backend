import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { IsStringArray } from 'src/decorators';

export class CreateRoleDto {
  @IsOptional()
  @IsNumber()
  adminId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsStringArray()
  permissions: string[];
}
