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
    const crafter = await prisma.user.findUnique({
      where: { id },
      include: {

      },
    });

    if (!crafter) {
      throw new AppError(404, 'Crafter not found');
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
};
