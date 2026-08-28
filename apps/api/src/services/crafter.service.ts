import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import type { ApplyCrafterDTO } from '@dorovu/shared';

export const CrafterService = {
  async applyCrafter(userId: string, data: ApplyCrafterDTO) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { crafterApplication: true, crafterStore: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.role === 'CRAFTER' || user.crafterStore) {
      throw new AppError(400, 'You are already a crafter');
    }

    if (user.crafterApplication) {
      if (user.crafterApplication.status === 'PENDING') {
        throw new AppError(400, 'You already have a pending application');
      } else if (user.crafterApplication.status === 'APPROVED') {
        throw new AppError(400, 'Your application was already approved');
      }
      
      // If rejected, allow them to update the existing application and resubmit
      return await prisma.crafterApplication.update({
        where: { id: user.crafterApplication.id },
        data: {
          storeName: data.storeName,
          description: data.description,
          craftType: data.craftType,
          status: 'PENDING',
        },
      });
    }

    // Create a new application
    return await prisma.crafterApplication.create({
      data: {
        userId,
        storeName: data.storeName,
        description: data.description,
        craftType: data.craftType,
        status: 'PENDING',
      },
    });
  },

  async getCrafterById(id: string) {
    const crafter = await prisma.crafterStore.findUnique({
      where: { id },
      include: {
        crafter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
    });

    if (!crafter) {
      throw new AppError(404, 'Crafter store not found');
    }

    return crafter;
  },

  async getCrafterStore(userId: string) {
    const store = await prisma.crafterStore.findUnique({
      where: { crafterId: userId },
    });

    if (!store) {
      throw new AppError(404, 'Crafter store not found');
    }

    return store;
  },

  async getTopCrafters(limit: number = 4) {
    const stores = await prisma.crafterStore.findMany({
      where: { isApproved: true },
      orderBy: [
        { rating: 'desc' },
        { totalSales: 'desc' },
      ],
      take: limit,
      include: {
        crafter: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    return stores;
  },
};
