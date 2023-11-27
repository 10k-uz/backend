import { Response } from 'express';
import { AdminsService } from '../admin.service';
import { paginationData } from 'src/interfaces';

/**
 * Handle the request to retrieve streams by promoterId.
 *
 * @param req - The HTTP request object containing promoter information.
 * @param res - The HTTP response object to send the response.
 * @param adminsService - An instance of the AdminsService class for database operations.
 */
export async function getAdminsHandler(
  data: paginationData,
  res: Response,
  adminsService: AdminsService,
) {
  let { page, limit, keyword } = data;

  /**
   * @find_admin
   * find admin by Id
   */
  let admins = await adminsService.getByPagination(page, limit, keyword);

  /**
   * @response
   * if everything is ok, send final success response with data
   */
  res.json({
    message: 'Admins info!',
    ...admins,
  });
}
