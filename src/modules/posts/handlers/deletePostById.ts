import { Response } from 'express';
import { deleted } from 'src/utils';
import { PostsService } from '../posts.service';

/**
 *
 * @param res
 * @param PostsService
 * @param id
 */
export async function deletePostById(
  res: Response,
  postsService: PostsService,
  id: string,
) {
  /**
   *
   * @delete_post
   * deleting post by Its ID
   *
   */
  await postsService.deleteOneById(+id);

  /**
   *
   * @response
   * as always, sending final success response
   *
   */
  res.json({
    message: deleted('post', 'id', id),
  });
}
