import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

interface roleType {
  adminId?: number;
  name: string;
  permissions: string[];
}

interface updateRoleType {
  name: string;
}

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaClient) {}

  async create(data: roleType) {
    return await this.prisma.roles.create({
      data: data,
    });
  }
  async getAll() {
    return await this.prisma.roles.findMany();
  }
  async getMultiple(ids: number[]) {
    return await this.prisma.roles.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
  async findByName(name: string) {
    return await this.prisma.roles.findUnique({
      where: {
        name,
      },
    });
  }
  async findById(id: number) {
    return await this.prisma.roles.findUnique({
      where: {
        id,
      },
    });
  }
  async update(id: number, data: updateRoleType) {
    return await this.prisma.roles.update({
      where: {
        id,
      },
      data: data,
    });
  }
  async delete(id: number) {
    return await this.prisma.roles.delete({
      where: {
        id,
      },
    });
  }
}
