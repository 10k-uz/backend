import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaClient) {}

  async create(image_url: string) {
    return await this.prisma.images.create({
      data: {
        image_url,
      },
    });
  }

  async getAll() {
    return await this.prisma.images.findMany();
  }

  async findOneById(id: number) {
    return await this.prisma.images.findUnique({
      where: {
        id,
      },
    });
  }

  async findByImageUrl(image_url: string) {
    return await this.prisma.images.findUnique({
      where: {
        image_url,
      },
    });
  }

  async update(id: number, image_url: string) {
    return await this.prisma.images.update({
      where: {
        id,
      },
      data: {
        image_url,
      },
    });
  }

  async deleteOneById(id: number) {
    return await this.prisma.images.delete({
      where: {
        id,
      },
    });
  }
}
