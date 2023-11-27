import { NotFoundException } from '@nestjs/common';
import { notFound } from 'src/utils';
import { Response } from 'express';
import { StreamsService } from '../streams.service';

/**
 * Handle the request to delete a stream by streamId.
 *
 * @param streamId - The unique identifier of the stream to be deleted.
 * @param res - The HTTP response object to send the response.
 * @param streamsService - An instance of the StreamsService class for database operations.
 */
export async function deleteStreamHandler(
  streamId: number,
  res: Response,
  streamsService: StreamsService,
) {
  /**
   * Find and retrieve the stream by its streamId.
   * If the stream is not found, throw a NotFoundException.
   */
  let stream = await streamsService.findById(streamId);
  if (!stream) {
    throw new NotFoundException({
      message: notFound('stream', 'Id', String(streamId)),
    });
  }

  /**
   * Delete the stream by its streamId.
   */
  await streamsService.deleteById(streamId);

  /**
   * Send the final success response after deleting the stream.
   */
  res.json({
    message: `Stream with ID ${streamId} is deleted.`,
    streamId,
  });
}
