import { IsIP, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateViewDto {
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsNumber()
  @IsOptional()
  streamId: number;

  @IsOptional()
  @IsIP()
  Ip: string;
}
