import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { appwriteStorage } from 'src/configs';
import { created } from 'src/utils';
import { ID } from 'appwrite';
import { InputFile } from 'node-appwrite';
import { ImagesService } from '../images.service';

export async function uploadSingleImageHandler(
  res: Response,
  file: Express.Multer.File,
) {
  /**
   *
   * @check_file
   * we'll check file, does it exist in request
   * if not found, throw an error indicates 400
   *
   */

  if (!file) {
    throw new HttpException('image is required field!', HttpStatus.BAD_REQUEST);
  }

  /**
   *
   * @convert_productId_to_number
   * by default, from form-data, datas come as a string
   * that is why, we'll change their type to number
   *
   */

  /**
   *
   * @create_image_data
   * create image data by passing them to imagesService
   *
   */
  const projectId = '653ba1e628cbfad98946';
  const bucketId = '653ba21e8f261e574900';

  // upload image to appwrite
  let appwriteUploader = await appwriteStorage.createFile(
    bucketId,
    ID.unique(),
    InputFile.fromPath(file.path, file.filename),
  );

  let uploadedImage = await appwriteStorage.getFile(
    bucketId,
    appwriteUploader.$id,
  );

  /**
   *
   * @response
   * sending final success response
   *
   */
  res.json({
    message: created('image', 'uploaded'),
    image_url: `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${uploadedImage.$id}/view?project=${projectId}`,
  });
}
