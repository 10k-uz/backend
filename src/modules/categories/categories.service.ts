import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateCategoryDto } from './dto';

interface CategoryType {
  adminId: number;
  name: string;
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaClient) {}

  create(data: CategoryType) {
    return this.prisma.categories.create({
      data,
    });
  }

  getByPagination(keyword?: string) {
    return this.prisma.categories.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        name: {
          contains: keyword ? keyword : undefined,
          mode: 'insensitive',
        },
      },
    });
  }

  findById(id: number) {
    return this.prisma.categories.findUnique({
      where: {
        id,
      },
    });
  }

  findByName(name: string) {
    return this.prisma.categories.findUnique({
      where: {
        name,
      },
    });
  }

  updateCategory(id: number, data: UpdateCategoryDto) {
    return this.prisma.categories.update({
      where: {
        id,
      },
      data,
    });
  }

  deleteOneById(id: number) {
    return this.prisma.categories.delete({
      where: {
        id,
      },
    });
  }
}
