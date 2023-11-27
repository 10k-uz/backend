import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Ip,
  Get,
} from '@nestjs/common';
import { ViewsService } from './views.service';
import { CreateViewDto } from './dto/view.dto';
import { PostRequest } from '../posts/interfaces';
import { Response } from 'express';
import { PostsGuard } from '../posts/posts.guard';
import { createViewHandler } from './handlers/createView';
import { StreamsService } from '../streams/streams.service';

@Controller('views')
export class ViewsController {
  constructor(
    private readonly viewsService: ViewsService,
    private readonly streamsService: StreamsService,
  ) {}

  @Post() //create view
  @UseGuards(PostsGuard)
  async create(
    @Body() createViewDto: CreateViewDto,
    @Req() req: PostRequest,
    @Res() res: Response,
  ) {
    return await createViewHandler(
      req,
      res,
      this.viewsService,
      createViewDto,
      this.streamsService,
    );
  }
}
