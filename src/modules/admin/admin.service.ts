import { Injectable } from '@nestjs/common';
import { CreateAdminDto, UpdateAuthDto } from './dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaClient) {}

  private selectableData: {
    id: true;
    adminId: true;
    name: true;
    username: true;
    roleId: true;
    password: false;
    createdAt: true;
    updatedAt: true;
  };

  async create(createAuthDto: CreateAdminDto) {
    return await this.prisma.admins.create({
      data: createAuthDto,
    });
  }

  async findAll() {
    return await this.prisma.admins.findMany({
      select: this.selectableData,
    });
  }

  async getByPagination(
    page: number = 1,
    limit: number = 10,
    keyword?: string,
  ) {
    if (page == 0) {
      page = 1;
    }

    let startIndex = (page - 1) * limit;

    let admins = await this.prisma.admins.findMany({
      where: {
        name: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
      skip: +startIndex,
      take: +limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        adminId: true,
        name: true,
        username: true,
        roleId: true,
        userType: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    let total_pages = Math.ceil((await this.prisma.admins.count()) / limit);

    return {
      meta: {
        current_page: +page,
        total_pages,
        limit: +limit,
      },
      admins,
    };
  }

  async findById(id: number) {
    return await this.prisma.admins.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        adminId: true,
        name: true,
        username: true,
        roleId: true,
        userType: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByUsername(username: string) {
    return await this.prisma.admins.findUnique({
      where: {
        username,
      },
      include: {
        CreatedRoles: true,
      },
    });
  }

  async updateById(id: number, updateAuthDto: UpdateAuthDto) {
    return await this.prisma.admins.update({
      where: {
        id,
      },
      data: updateAuthDto,
    });
  }

  async deleteOneById(id: number) {
    return await this.prisma.admins.delete({
      where: {
        id,
      },
    });
  }

  async adminsCount() {
    return await this.prisma.admins.count();
  }
}
