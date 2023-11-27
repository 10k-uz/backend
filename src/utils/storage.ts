import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

export const multerOptions = (path: string) => {
  return {
    fileFilter: (req: any, file: any, cb: any) => {
      let fileType = file.mimetype.match(/\/(jpg|jpeg|png|gif)$/);

      if (fileType) {
        cb(null, true);
      } else {
        cb(
          new HttpException(
            `Unsupported file type ${extname(file.originalname)}`,
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, path);
      },
      filename: (req, file, cb) => {
        cb(null, `${uuid()}${extname(file.originalname)}`);
      },
    }),
  };
};
