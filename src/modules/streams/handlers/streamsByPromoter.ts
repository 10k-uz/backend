import { Response } from 'express';
import { UserRequest, paginationData } from 'src/interfaces';
import { StreamsService } from '../streams.service';

/**
 * Handle the request to retrieve streams by promoterId.
 *
 * @param req - The HTTP request object containing promoter information.
 * @param res - The HTTP response object to send the response.
 * @param streamsService - An instance of the StreamsService class for database operations.
 */
export async function streamsByPromoterHandler(
  req: UserRequest,
  res: Response,
  streamsService: StreamsService,
  data: paginationData,
) {
  /**
   * Find and retrieve streams associated with the promoterId.
   */
  let streams = await streamsService.getByPromoterId(
    req.user.info.id,
    data.page,
    data.limit,
    data.keyword,
    String(data.categoryId),
  );

  /**
   * Send the final response with the retrieved streams.
   *
   * Note:
   * We do not send a BadRequest response even if the streams array is empty,
   * as it may lead to issues on the front-end.
   */
  res.json({
    message: `Streams by promoterId ${req.user.info.id}`,
    ...streams,
  });
}
