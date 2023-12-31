import { IsOptional, IsString } from 'class-validator';

export class UpdateInfoDto {
  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;
}
