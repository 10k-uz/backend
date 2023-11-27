import { Response } from 'express';
import { notFound, updated } from 'src/utils';
import { UpdatePostDto } from '../dto';
import { PostsService } from '../posts.service';
import { CategoriesService } from 'src/modules/categories/categories.service';
import { NotFoundException } from '@nestjs/common';

export async function updatePost(
  res: Response,
  postsService: PostsService,
  categoriesService: CategoriesService,
  updatePostDto: UpdatePostDto,
  id: string,
) {
  // find category first
  if (updatePostDto.categoryId) {
    let category = await categoriesService.findById(updatePostDto.categoryId);
    if (!category) {
      throw new NotFoundException(
        notFound('category', 'Id', updatePostDto.categoryId),
      );
    }
  }

  /**
   *
   * @update
   * updating post info
   *
   */
  let updateInfo = await postsService.update(+id, updatePostDto);

  /**
   *
   * @response
   * as always, we will send final success response
   *
   */
  res.json({
    message: updated('post', 'id', id),
    info: updateInfo,
  });
}
