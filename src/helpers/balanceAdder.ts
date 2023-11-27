import { NotFoundException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'src/utils';

const prisma = new PrismaClient();

export async function balanceAdder(
  userType: UserType,
  userId: number,
  streamId?: number,
) {
  // find asset first
  let finAsset = await prisma.financialAsset.findFirst();
  if (!finAsset) {
    throw new NotFoundException(`fin-asset is not found!`);
  }

  if (userType === 'ADMIN') {
    let findAdmin = await prisma.admins.findUnique({
      where: {
        id: userId,
      },
    });
    if (!findAdmin) {
      throw new NotFoundException(notFound('admin', 'adminId', String(userId)));
    }

    // add new amount to admin's balance
    await prisma.admins.update({
      where: {
        id: userId,
      },
      data: {
        balance: findAdmin.balance + finAsset.bonusPerView,
      },
    });

    return;
  } else if (userType === 'PROMOTER') {
    let findPromoter = await prisma.promoters.findUnique({
      where: {
        id: userId,
      },
    });
    if (!findPromoter) {
      throw new NotFoundException(
        notFound('promoter', 'promoterId', String(userId)),
      );
    }

    // add new amount to promoter's balance
    await prisma.promoters.update({
      where: {
        id: userId,
      },
      data: {
        balance: findPromoter.balance + finAsset.bonusPerView,
      },
    });

    // decrease amount from deposit
    await prisma.financialAsset.update({
      where: {
        id: finAsset.id,
      },
      data: {
        deposit: finAsset.deposit - finAsset.bonusPerView,
      },
    });

    // add new amount to history
    await prisma.streamStats.update({
      where: {
        streamId,
      },
      data: {
        streamId,
        profit:
          (
            await prisma.streamStats.findUnique({ where: { streamId } })
          ).profit + finAsset.bonusPerView,
        views:
          (await prisma.streamStats.findUnique({ where: { streamId } })).views +
          1,
      },
    });

    return;
  }
}
