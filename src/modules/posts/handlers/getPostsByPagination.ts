import { Response } from 'express';
import { PostsService } from '../posts.service';
import { paginationData } from 'src/interfaces';

export async function getPosts(
  res: Response,
  postsService: PostsService,
  data: paginationData,
) {
  /**
   *
   * @find_posts
   * here, I will find all posts
   *
   */
  let posts = await postsService.getByPagination(data, data.role);

  /**
   *
   * @response
   * we will send final responses
   * even if array's length is equal to 0, we will send that result
   * because, if we send it with status code 404, it is gonna be error
   * and it may be some headache for frontend devs :)
   *
   */
  res.json({
    message: `posts by pagination`,
    ...posts,
  });
}
