import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

import { Response } from 'express';
import { UserRequest } from 'src/interfaces';
import { created, deleted, existed, info } from 'src/utils';
import { Perms } from 'src/decorators';
import { PermsGuard } from 'src/guards';
import { updateCategoryHandler } from './handlers';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Perms(['CATEGORY', 'ALL'])
  @UseGuards(PermsGuard)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
    @Req() req: UserRequest,
  ) {
    // collecting nessessary info
    let data = {
      ...createCategoryDto,
      adminId: req.user.info.id,
    };

    /**
     *
     * @check_category
     * checking category's existance, if exists, we will return bad request status
     *
     */
    let findCategory = await this.categoriesService.findByName(data.name);
    if (findCategory) {
      throw new HttpException(
        existed('category', `name ${data.name}`),
        HttpStatus.BAD_REQUEST,
      );
    }

    /**
     *
     * @create
     * now, everything is fine, we will create a category!
     *
     */
    let category = await this.categoriesService.create(data);

    /**
     *
     * @response
     * sending final success response with status 201
     *
     */
    res.json({
      message: created('category'),
      info: category,
    });
  }

  @Get()
  async getAll(@Res() res: Response, @Query('keyword') keyword: string) {
    // find categories
    let categories = await this.categoriesService.getByPagination(keyword);

    // send final response
    res.json({
      message: `Here is all categories`,
      categories,
    });
  }

  @Get(':id')
  async findOneById(@Param('id') id: string, @Res() res: Response) {
    /**
     *
     * @find_by_id
     * find category by id, if not found, we will throw the error indicates 404
     *
     */
    let category = await this.categoriesService.findById(+id);
    if (!category) {
      throw new HttpException(
        `category with ID ${id} is not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    /**
     *
     * @response
     * if everything is ok, we will send final success response with category
     *
     */
    res.json({
      message: info('Category', 'Id', id),
      category,
    });
  }

  @Put(':id')
  async updateCategory(
    @Body() data: UpdateCategoryDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return await updateCategoryHandler(
      { id: +id, name: data.name },
      res,
      this.categoriesService,
    );
  }

  @Delete(':id')
  async deleteOneById(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: UserRequest,
  ) {
    /**
     *
     * @find_by_Id
     * find category by id, if not found, we will throw the error indicates 404
     *
     */
    let category = await this.categoriesService.findById(+id);
    if (!category) {
      throw new HttpException(
        `category with ID ${id} is not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    /**
     *
     * @delete
     * deleting category by it's Id, if something goes wrong, we will throw it with error (HttpException)
     *
     */
    let deleteCategory = await this.categoriesService.deleteOneById(+id);

    /**
     *
     * @response
     * if everything is ok, we will send final success response with category
     *
     */
    res.json({
      message: deleted('category', 'Id', id),
      categoryId: deleteCategory.id,
      deletedBy: `adminId_${req.user.info.id}, username_${req.user.info.username}`,
    });
  }
}
