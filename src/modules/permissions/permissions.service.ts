import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface permTypes {
  adminId?: number;
  name: string;
}

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaClient) {}

  async create(data: permTypes) {
    return await this.prisma.permissions.create({
      data: data,
    });
  }

  async getAll() {
    return await this.prisma.permissions.findMany();
  }

  async getMultiple(names: string[]) {
    return await this.prisma.permissions.findMany({
      where: {
        name: {
          in: names,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findByName(name: string) {
    return await this.prisma.permissions.findUnique({
      where: {
        name,
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.permissions.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: permTypes) {
    return await this.prisma.permissions.update({
      where: {
        id,
      },
      data: data,
    });
  }

  async delete(id: number) {
    return await this.prisma.permissions.delete({
      where: {
        id,
      },
    });
  }
}
