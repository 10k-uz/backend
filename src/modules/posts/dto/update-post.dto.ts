import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsString()
  @Length(5, 200)
  title: string;

  @IsOptional()
  @IsString()
  @Length(10)
  descr: string;

  @IsOptional()
  @IsString()
  cover_image: string;

  @IsOptional()
  @IsBoolean()
  isCPA: boolean;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  ads_post_link: string;
}
