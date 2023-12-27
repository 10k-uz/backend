import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaClient, UserType } from '@prisma/client';
import { paginationData } from 'src/interfaces';
import { UpdatePostDto } from './dto';

interface PostData extends CreatePostDto {
  adminId?: number;
}

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaClient) {}

  async create(data: PostData) {
    return await this.prisma.posts.create({
      data,
    });
  }

  async getByPagination(data: paginationData, role: UserType) {
    const { page = 1, limit = 10, keyword, categoryId } = data;
    const startIndex = Math.max(page - 1, 0) * limit;

    const sortedPosts = async () => {
      if (role.toUpperCase() === 'ADMIN') {
        let postData = await this.prisma.posts.findMany({
          skip: +startIndex,
          take: +limit,
          where: {
            title: {
              contains: keyword,
              mode: 'insensitive',
            },
            categoryId: categoryId !== undefined ? +categoryId : undefined,
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        });

        return postData.map((item) => {
          return {
            ...item,
            category: item.category && item.category.name,
            views: item.views | 0,
          };
        });
      } else if (role.toUpperCase() === 'PROMOTER') {
        return await this.prisma.posts.findMany({
          skip: +startIndex,
          take: +limit,
          where: {
            categoryId: categoryId !== undefined ? +categoryId : undefined,
            title: {
              contains: keyword,
              mode: 'insensitive',
            },
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            descr: true,
            cover_image: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      }
    };

    let postsData = await sortedPosts();
    let total_pages = Math.ceil(
      (await this.prisma.posts.count({
        where: {
          isActive: true,
        },
      })) / limit,
    );
    let total_length = await this.prisma.posts.count({
      where: {
        isActive: true,
      },
    });

    const response = {
      categoryId: categoryId ? +categoryId : undefined,
      meta: {
        total_pages,
        total_length,
        current_page: +page,
        limit: +limit,
        found_results: postsData.length,
      },
      posts: postsData,
    };

    return response;
  }

  async getForUser(page: number = 1, limit: number = 10) {
    if (page == 0) {
      page = 1;
    }

    let startIndex = (page - 1) * limit;

    let posts = await this.prisma.posts.findMany({
      where: {
        isActive: true,
      },
      skip: +startIndex,
      take: +limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    let total_pages = Math.ceil((await this.prisma.posts.count()) / limit);
    let total_length = await this.prisma.posts.count();
    let found_results = posts.length;

    return {
      meta: {
        current_page: +page,
        total_pages,
        total_length,
        found_results,
      },
      posts,
    };
  }

  async findById(id: number) {
    return await this.prisma.posts.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdatePostDto) {
    return await this.prisma.posts.update({
      where: {
        id,
      },
      data,
    });
  }

  async updateView(id: number, views: number) {
    return await this.prisma.posts.update({
      where: {
        id,
      },
      data: {
        views,
      },
    });
  }

  async deleteOneById(id: number) {
    return await this.prisma.posts.delete({
      where: {
        id,
      },
    });
  }
}
