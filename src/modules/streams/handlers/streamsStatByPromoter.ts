import { Response } from 'express';
import { UserRequest, paginationData } from 'src/interfaces';
import { StreamsService } from '../streams.service';

/**
 * Handle the request to retrieve statistics from streams by promoterId.
 *
 * @param req - The HTTP request object containing promoter information.
 * @param res - The HTTP response object to send the response.
 * @param streamsService - An instance of the StreamsService class for database operations.
 * @param data - Data is an object come by queries from controller
 *
 */
export async function streamsStatByPromoter(
  req: UserRequest,
  res: Response,
  streamsService: StreamsService,
  data: paginationData,
) {
  const promoterId = req.user.info.id;

  /**
   *
   * @get_streams
   * here, we have to get streams with statistic data
   *
   */
  let { total_pages, current_page, limit, stats, total_profit, total_length } =
    await streamsService.getStatsByPromoterId(
      promoterId,
      data.page,
      data.limit,
      data.keyword,
    );

  /**
   *
   * @formating_stats
   * in order to be shown more clear, we have to extract and format them
   *
   */
  let formatedStats = stats.map((item) => {
    const {
      stream: { name },
      streamId,
      views,
      profit,
      createdAt,
      updatedAt,
    } = item;

    return { Id: streamId, name, views, profit, createdAt, updatedAt };
  });

  /***
   *
   * @response
   * sending final sucess response
   *
   */
  res.json({
    total_profit,
    meta: {
      current_page,
      limit,
      total_pages,
      total_length,
    },
    stats: formatedStats,
  });
}
