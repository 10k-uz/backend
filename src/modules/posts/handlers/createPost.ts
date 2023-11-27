import { Response } from 'express';
import { PostsService } from '../posts.service';
import { CategoriesService } from 'src/modules/categories/categories.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { created, notFound } from 'src/utils';
import { CreatePost } from '../interfaces';
import { UserRequest } from 'src/interfaces';

/**
 *
 * @param data -- this is data from request
 * @param req -- Requests that is extended with user
 * @param res -- Response(express)
 * @param postsService -- this is used to work with products table on database
 * @param categoriesService -- this is used to work with categories table on database
 *
 */
export async function createPost(
  data: CreatePost,
  req: UserRequest,
  res: Response,
  postsService: PostsService,
  categoriesService: CategoriesService,
) {
  /**
   *
   * @find_category
   * find category by incame categoryId
   * If not found, we will throw an error indicates status code 404
   *
   */
  let category = await categoriesService.findById(data.categoryId);
  if (!category) {
    throw new HttpException(
      notFound('category', 'Id', `${data.categoryId}`),
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   *
   * @prepare_data
   * here, we will prepare data to create
   *
   */
  let CreatePostData = {
    ...data,
    adminId: req.user.info.id,
  };

  /**
   *
   * @create_product
   * if everything is ok,  we will creata a product
   *
   */
  let product = await postsService.create(CreatePostData);

  /**
   *
   * @response
   * then we will send final success response
   *
   */
  res.json({
    message: created('post', 'is'),
    info: product,
  });
}
