import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Request } from 'express';

@Injectable()
export class PostsGuard implements CanActivate {
  constructor(private postsService: PostsService) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();

    let general_postId: string;

    /**
     *
     * @get_ID_from_request
     * get an ID from request
     *
     */
    let { id } = req.params;
    let { postId } = req.body;

    if (!id && !postId) {
      throw new HttpException(
        `Either id or postId should be provided!`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else if (id && postId) {
      throw new HttpException(
        `you can only send postId either from params or body!`,
        HttpStatus.BAD_REQUEST,
      );
    } else if (id && !postId) {
      general_postId = id;
    } else if (!id && postId) {
      general_postId = postId;
    }

    /**
     *
     * @check_post
     * now, we will check post's existability by its ID
     * if not found, we will throw an error that indicates 400 (Bad request)
     *
     */
    let post = await this.postsService.findById(+general_postId);
    if (!post) {
      throw new NotFoundException(
        `post with ID ${general_postId} is not found!`,
      );
    }

    /**
     *
     * @give_post_to_request
     * giving post to request in order to avoid repetition in code!
     *
     */
    req['post'] = post;

    /**
     *
     * @set_true
     * And, return true, in order to continue operation
     *
     */
    return true;
  }
}
