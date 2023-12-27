import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Put,
  UseGuards,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
  updatePost,
  getPostByStreamHandler,
  getPostsForUser,
} from './handlers';
import { Response } from 'express';
import { CategoriesService } from '../categories/categories.service';
import { PostsGuard } from './posts.guard';
import { UserRequest, paginationData } from 'src/interfaces';
import { Perms } from 'src/decorators';
import { PermsGuard } from 'src/guards';
import { StreamsService } from '../streams/streams.service';
import { UserType } from '@prisma/client';
import { UpdatePostDto } from './dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly streamsService: StreamsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  @Perms(['POST'])
  @UseGuards(PermsGuard)
  async create(
    @Body() CreatePostDto: CreatePostDto,
    @Req() req: UserRequest,
    @Res() res: Response,
  ) {
    return await createPost(
      CreatePostDto,
      req,
      res,
      this.postsService,
      this.categoriesService,
    );
  }

  @Get()
  async getPosts(
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('keyword') keyword: string,
    @Query('categoryId') categoryId: string,
    @Query('role') role: UserType,
  ) {
    if (!role) {
      throw new BadRequestException(
        'role should be provided in order to retrieve data!',
      );
    } else if (
      role.toUpperCase() !== UserType.ADMIN &&
      role.toUpperCase() !== UserType.PROMOTER
    ) {
      throw new BadRequestException('role should be either PROMOTER or ADMIN');
    }

    if (categoryId === ('' || 'default')) {
      categoryId = undefined;
    }

    return await getPosts(res, this.postsService, {
      page,
      limit,
      categoryId,
      keyword,
      role,
    });
  }

  @Get('/user')
  async getPostsForUser(@Res() res: Response, @Query() data: paginationData) {
    return await getPostsForUser(res, this.postsService, data);
  }

  @Get('common/:id')
  @UseGuards(PostsGuard)
  async getPostById(@Param('id') id: string, @Res() res: Response) {
    return await getPostById(res, +id, this.postsService);
  }

  @Get('stream')
  async getPostByStream(
    @Res() res: Response,
    @Query('postId') postId: string,
    @Query('streamId') streamId: string,
  ) {
    if (!postId || !streamId) {
      throw new BadRequestException({
        message: `postId and streamId are required field!`,
      });
    }
    return await getPostByStreamHandler(
      res,
      +postId,
      +streamId,
      this.streamsService,
      this.postsService,
    );
  }

  @Put(':id')
  @UseGuards(PostsGuard)
  async update(
    @Param('id') id: string,
    @Body() updatepostDto: UpdatePostDto,
    @Res() res: Response,
  ) {
    return await updatePost(
      res,
      this.postsService,
      this.categoriesService,
      updatepostDto,
      id,
    );
  }

  @Delete(':id')
  @UseGuards(PostsGuard)
  async deleteOneById(@Param('id') id: string, @Res() res: Response) {
    return await deletePostById(res, this.postsService, id);
  }
}
