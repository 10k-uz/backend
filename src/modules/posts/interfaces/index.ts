import { CreatePostDto } from '../dto';
import { Posts } from '@prisma/client';

export interface CreatePost extends CreatePostDto {
  cover_image: string;
}

export interface PostRequest extends Request {
  post: Posts;
}
