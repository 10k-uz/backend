import { NotFoundException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { BONUS_PER_VIEW } from 'src/constants';
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
        balance: findAdmin.balance + BONUS_PER_VIEW,
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
        balance: findPromoter.balance + BONUS_PER_VIEW,
      },
    });

    // decrease amount from deposit
    await prisma.financialAsset.update({
      where: {
        id: finAsset.id,
      },
      data: {
        deposit: finAsset.deposit - BONUS_PER_VIEW,
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
          ).profit + BONUS_PER_VIEW,
        views:
          (await prisma.streamStats.findUnique({ where: { streamId } })).views +
          1,
      },
    });

    return;
  }
}
