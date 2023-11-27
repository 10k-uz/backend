import { StreamsService } from 'src/modules/streams/streams.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { info, notFound } from 'src/utils';
import { PostsService } from '../posts.service';
import { Response } from 'express';

export async function getPostByStreamHandler(
  res: Response,
  postId: number,
  streamId: number,
  streamsService: StreamsService,
  postsService: PostsService,
) {
  /**
   *
   * @finf_stream
   * find stream by streamId
   *
   */
  let stream = await streamsService.findById(streamId);
  if (!stream) {
    throw new NotFoundException({
      message: notFound('stream', 'streamId', String(streamId)),
    });
  }

  /**
   *
   * @find_post
   * find post by postId
   *
   */
  let post = await postsService.findById(postId);
  if (!post) {
    throw new NotFoundException({
      message: notFound('post', 'postId', String(postId)),
    });
  }

  /**
   *
   * @compare_postId_and_streamPostId
   *
   * here, we have to compare postId with postId that is come in stream data
   * if they don't match, we return bad request exception
   *
   */
  if (postId !== stream.postId) {
    throw new BadRequestException({
      message: `postId and streamId do not match!`,
    });
  }

  /**
   *
   * @response
   * send final success response
   *
   */
  res.json({
    message: info('post', 'Id', String(postId)),
    post,
  });
}
