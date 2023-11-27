import { UserRequest } from 'src/interfaces';
import { CreateStreamDto } from '../dto';
import { StreamsService } from '../streams.service';
import { PostsService } from 'src/modules/posts/posts.service';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { created } from 'src/utils';

/**
 * Handle the request to create a new stream.
 *
 * @param data - The data for creating the stream (CreateStreamDto).
 * @param req - The HTTP request object containing promoter information.
 * @param res - The HTTP response object to send the response.
 * @param streamsService - An instance of the StreamsService class for database operations.
 * @param postsService - An instance of the PostsService class for checking the existence of the associated post.
 */
export async function createStreamHandler(
  data: CreateStreamDto,
  req: UserRequest,
  res: Response,
  streamsService: StreamsService,
  postsService: PostsService,
) {
  /**
   * @check_post
   * Check if the associated post exists by its ID.
   * If not found, throw a NotFoundException.
   */
  let post = await postsService.findById(data.postId);
  if (!post) {
    throw new NotFoundException(`Post with ID ${data.postId} is not found!`);
  }

  /**
   * @prepare_stream_data
   * Prepare stream data by merging promoterId from the request.
   * The promoterId is obtained from the request by middleware.
   * If the promoter is not found by promoterID, middlewares handle this problem.
   */
  let prepareData = {
    ...data,
    promoterId: req.user.info.id,
  };

  /**
   * @create_stream
   * Create a new stream using the prepared data.
   */
  let createdStream = await streamsService.create(prepareData);

  res.json({
    message: created('stream', 'is'),
    stream_Id: createdStream.id,
    info: createdStream,
  });
}
