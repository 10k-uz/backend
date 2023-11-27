import { Injectable } from '@nestjs/common';
import { CreateFinAssetDto, UpdateFinAssetDto } from './dto/fin-asset.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FinAssetsService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateFinAssetDto) {
    return await this.prisma.financialAsset.create({
      data,
    });
  }

  async haveAssets() {
    return await this.prisma.financialAsset.count();
  }

  async findById(id: number) {
    return await this.prisma.financialAsset.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: UpdateFinAssetDto) {
    return await this.prisma.financialAsset.update({
      where: {
        id,
      },
      data,
    });
  }

  async getAsset() {
    return await this.prisma.financialAsset.findFirst();
  }
}
