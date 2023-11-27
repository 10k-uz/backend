import {
  Injectable,
  CanActivate,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FinAssetsService } from 'src/modules/fin-assets/fin-assets.service';

@Injectable()
export class DepositGuard implements CanActivate {
  constructor(private readonly finAssetsService: FinAssetsService) {}

  async canActivate() {
    let finAsset = await this.finAssetsService.getAsset();
    if (!finAsset) {
      throw new NotFoundException(`fin-asset is not found!`);
    } else if (finAsset.deposit === 0) {
      throw new BadRequestException({
        message: `Payments are currently suspended until new deposits are added.`,
        isClosed: true,
      });
    }

    return true;
  }
}
