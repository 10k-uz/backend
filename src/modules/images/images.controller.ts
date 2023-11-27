import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/storage';
import { Response } from 'express';
import { deleted, info, notFound } from 'src/utils';
import { uploadSingleImageHandler } from './handlers';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions('public/images')))
  async uploadSingleImage(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await uploadSingleImageHandler(res, file);
  }

  @Get()
  async getAll(@Res() res: Response) {
    /**
     *
     * @get_images
     * getting all images from db
     *
     */

    let images = await this.imagesService.getAll();

    /**
     *
     * @response
     * sending final success response
     *
     */
    res.json({
      message: `All images`,
      images,
    });
  }

  @Get(':id')
  async findOneById(@Param('id') id: string, @Res() res: Response) {
    /**
     *
     * @find_image_by_Id
     * find image by its ID
     */
    let image = await this.imagesService.findOneById(+id);
    if (!image) {
      throw new HttpException(
        notFound('image', 'id', id),
        HttpStatus.NOT_FOUND,
      );
    }

    /**
     *
     * @response
     * if everything is ok, we'll send data of that image
     *
     */
    res.json({
      message: info('Image', 'Id', id),
      image,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string) {
    // return await this.imagesService.update(+id, updateImage);
    return 'just updated! TEST';
  }

  @Delete(':id')
  async deleteOneById(@Param('id') id: string, @Res() res: Response) {
    /**
     * @find_image
     * we'll find image by its ID
     *
     */
    let image = await this.imagesService.findOneById(+id);
    if (!image) {
      throw new HttpException(
        notFound('image', 'id', id),
        HttpStatus.NOT_FOUND,
      );
    }

    /**
     *
     * @delete_image
     * delete image from db
     *
     */
    await this.imagesService.deleteOneById(+id);

    /**
     *
     * @response
     * if everything is ok, we'll send final success response
     *
     */
    res.json({
      message: deleted('image', 'id', id),
    });
  }
}
