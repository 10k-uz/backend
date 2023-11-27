import { Response } from 'express';
import { PostsService } from '../posts.service';
import { NotFoundException } from '@nestjs/common';
import { notFound } from 'src/utils';

export async function getPostById(
  res: Response,
  id: number,
  postsService: PostsService,
) {
  // find post
  let post = await postsService.findById(id);
  if (!post) {
    throw new NotFoundException(notFound('post', 'Id', id));
  }

  let formattedPost = {
    ...post,
    category: post.category && post.category.name,
  };

  /**
   *
   * @response
   * if eveything is ok, we will send post with its info!
   *
   */
  res.json({
    message: `post info with ID ${id}`,
    post: formattedPost,
  });
}
