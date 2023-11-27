import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Get,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { StreamsService } from './streams.service';
import { CreateStreamDto } from './dto/stream.dto';
import { UserRequest } from 'src/interfaces';
import { PostsService } from '../posts/posts.service';
import { Response } from 'express';
import {
  createStreamHandler,
  deleteStreamHandler,
  singleStreamStatsHandler,
  streamsStatByPromoter,
  streamsByPromoterHandler,
  streamsStatByPagination,
} from './handlers';
import { PromotersGuard } from 'src/guards';

@Controller('streams')
export class StreamsController {
  constructor(
    private readonly streamsService: StreamsService,
    private readonly postsService: PostsService,
  ) {}

  @Post() // Create a new stream
  @UseGuards(PromotersGuard)
  async createStream(
    @Body() data: CreateStreamDto,
    @Req() req: UserRequest,
    @Res() res: Response,
  ) {
    return await createStreamHandler(
      data,
      req,
      res,
      this.streamsService,
      this.postsService,
    );
  }

  @Get() // Get streams for the current promoter
  @UseGuards(PromotersGuard)
  async getPromoterStreams(
    @Req() req: UserRequest,
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('keyword') keyword: string,
    @Query('categoryId') categoryId: string,
  ) {
    if (categoryId === ('' || 'default')) {
      categoryId = undefined;
    }

    return await streamsByPromoterHandler(req, res, this.streamsService, {
      page,
      limit,
      keyword,
      categoryId,
    });
  }

  @Get('admin') // Get streams by pagination
  async getStreams(
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('keyword') keyword: string,
    @Query('categoryId') categoryId: string,
  ) {
    if (categoryId === ('' || 'default')) {
      categoryId = undefined;
    }

    return await streamsStatByPagination(res, this.streamsService, {
      page,
      limit,
      keyword,
      categoryId,
    });
  }

  @Get('stats/:streamId') // Get statistics for a single stream by streamId
  async getSingleStreamStats(
    @Param('streamId') streamId: string,
    @Res() res: Response,
  ) {
    return singleStreamStatsHandler(+streamId, res, this.streamsService);
  }

  @Get('stats') // Get stream statistics by promoter
  async getStreamStatsByPromoter(
    @Req() req: UserRequest,
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('keyword') keyword: string,
  ) {
    return await streamsStatByPromoter(req, res, this.streamsService, {
      page,
      limit,
      keyword,
    });
  }

  @Delete(':streamId') // Delete a stream by streamId
  async deleteStream(
    @Param('streamId') streamId: string,
    @Res() res: Response,
  ) {
    return await deleteStreamHandler(+streamId, res, this.streamsService);
  }
}
