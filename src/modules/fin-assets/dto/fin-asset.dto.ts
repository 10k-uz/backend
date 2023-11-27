import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateFinAssetDto {
  @IsNotEmpty()
  @IsNumber()
  deposit: number;

  @IsNotEmpty()
  @IsNumber()
  bonusPerView: number;
}

export class UpdateFinAssetDto {
  @IsOptional()
  @IsNumber()
  deposit: number;

  @IsOptional()
  @IsNumber()
  bonusPerView: number;
}
