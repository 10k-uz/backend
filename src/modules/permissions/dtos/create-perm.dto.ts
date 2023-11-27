import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePermDto {
  @IsOptional()
  @IsNumber()
  adminId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
