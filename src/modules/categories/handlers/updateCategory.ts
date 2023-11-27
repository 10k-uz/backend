import { Response } from 'express';
import { UpdateCategoryDto } from '../dto';
import { CategoriesService } from '../categories.service';
import { NotFoundException } from '@nestjs/common';
import { notFound, updated } from 'src/utils';

interface categoryType extends UpdateCategoryDto {
  id: number;
}

export async function updateCategoryHandler(
  data: categoryType,
  res: Response,
  categoriesService: CategoriesService,
) {
  // find category
  let category = await categoriesService.findById(data.id);
  if (!category) {
    throw new NotFoundException(notFound('category', 'Id', data.id));
  }

  // update category
  let updateCategory = await categoriesService.updateCategory(data.id, data);

  // send final success response
  res.json({
    message: updated('category', 'Id', String(data.id)),
    info: updateCategory,
  });
}
