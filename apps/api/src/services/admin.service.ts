import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';

export const AdminService = {
  async getApplications(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return await prisma.crafterApplication.findMany({
      where: status ? { status } : undefined,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async approveApplication(applicationId: string) {
    const application = await prisma.crafterApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    if (application.status === 'APPROVED') {
      throw new AppError(400, 'Application is already approved');
    }

    // Execute in transaction: 
    // 1. Update application status
    // 2. Create CrafterProfile
    // 3. Update User role
    return await prisma.$transaction(async (tx) => {
      const updatedApp = await tx.crafterApplication.update({
        where: { id: applicationId },
        data: { status: 'APPROVED' },
      });

      await tx.crafterProfile.create({
        data: {
          userId: application.userId,
          storeName: application.storeName,
          description: application.description,
          craftType: application.craftType,
        },
      });

      await tx.user.update({
        where: { id: application.userId },
        data: { role: 'CRAFTER' },
      });

      return updatedApp;
    });
  },

  async rejectApplication(applicationId: string) {
    const application = await prisma.crafterApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    if (application.status === 'REJECTED') {
      throw new AppError(400, 'Application is already rejected');
    }

    if (application.status === 'APPROVED') {
      throw new AppError(400, 'Cannot reject an already approved application');
    }

    return await prisma.crafterApplication.update({
      where: { id: applicationId },
      data: { status: 'REJECTED' },
    });
  }
};
