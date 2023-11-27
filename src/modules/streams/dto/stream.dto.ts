import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateStreamDto {
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  name: string;
}

export class DeleteStreamDto {
  @IsNumber()
  @IsNotEmpty()
  streamId: number;
}
