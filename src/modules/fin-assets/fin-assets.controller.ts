import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  Put,
  Param,
  NotFoundException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { FinAssetsService } from './fin-assets.service';
import { CreateFinAssetDto, UpdateFinAssetDto } from './dto/fin-asset.dto';
import { Response } from 'express';
import { created } from 'src/utils';
import { BasicAuthGuard, PermsGuard } from 'src/guards';
import { Perms } from 'src/decorators';

@Controller('fin-assets')
export class FinAssetsController {
  constructor(private readonly finAssetsService: FinAssetsService) {}

  @Post()
  @UseGuards(PermsGuard)
  @Perms(['FIN-ASSETS'])
  @UseGuards(BasicAuthGuard)
  async create(
    @Body() createFinAssetDto: CreateFinAssetDto,
    @Res() res: Response,
  ) {
    // get asset(s) for checking
    let haveAssets = await this.finAssetsService.haveAssets();

    // if asset already exists
    if (haveAssets > 0) {
      throw new BadRequestException(
        'Financial Assets can only been created just once!',
      );
    }

    // creating an asset
    let createdAsset = await this.finAssetsService.create(createFinAssetDto);

    res.json({
      message: created('Financial asset', 'is', 'created'),
      info: createdAsset,
    });
  }

  @Put()
  @UseGuards(BasicAuthGuard)
  async update(
    @Body() updateFinAssetDto: UpdateFinAssetDto,
    @Res() res: Response,
  ) {
    //find asset by ID
    let asset = await this.finAssetsService.getAsset();
    if (!asset) {
      throw new NotFoundException('fin-asset is not found!');
    }

    // update info
    let updateInfo = await this.finAssetsService.update(
      asset.id,
      updateFinAssetDto,
    );

    // sending final response
    res.json({
      message: 'fin-asset is updated successfully!',
      info: updateInfo,
    });
  }

  @Get()
  async getAsset(@Res() res: Response) {
    let asset = await this.finAssetsService.getAsset();

    if (!asset) {
      throw new NotFoundException('fin-asset is not found!');
    }

    res.json({
      message: 'Fin-asset info!',
      info: asset,
    });
  }

  @Get('deposit-status')
  async getDepositStatus(@Res() res: Response) {
    let asset = await this.finAssetsService.getAsset();

    if (!asset) {
      throw new NotFoundException('fin-asset is not found!');
    }

    res.json({
      message: 'Here is a deposit status',
      isActive: asset.deposit > 0 ? true : false,
    });
  }
}
