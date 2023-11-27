import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  @Length(5, 200)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(10)
  descr: string;

  @IsNotEmpty()
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
