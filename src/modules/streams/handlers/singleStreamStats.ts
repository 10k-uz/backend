import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { info, notFound } from 'src/utils';
import { StreamsService } from '../streams.service';

/**
 * Handle the request to retrieve statistics for a single stream by streamId.
 *
 * @param streamId - The unique identifier of the stream.
 * @param res - The HTTP response object to send the response.
 * @param streamsService - An instance of the StreamsService class for database operations.
 */
export async function singleStreamStatsHandler(
  streamId: number,
  res: Response,
  streamsService: StreamsService,
) {
  /**
   * Find and retrieve the stream by its streamId.
   * If the stream is not found, throw a NotFoundException.
   */
  let stream = await streamsService.findById(+streamId);
  if (!stream) {
    throw new NotFoundException(
      notFound('stream', 'streamId', String(streamId)),
    );
  }

  /**
   * Retrieve stream statistics by streamId if the stream is found.
   */
  let streamStats = await streamsService.getStatsById(+streamId);

  /**
   * Send the final response with the retrieved stream statistics.
   */
  res.json({
    message: info('stream stats', 'streamId', String(streamId)),
    ...streamStats,
  });
}
