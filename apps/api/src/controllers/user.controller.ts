import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { UpdateProfileSchema } from '@dorovu/shared';
import bcrypt from 'bcryptjs';

export class UserController {
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const parsed = UpdateProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.issues });
        return;
      }

      const { firstName, lastName, email, password } = parsed.data;

      // Ensure user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Check email uniqueness if email is changed
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });

        if (emailExists) {
          res.status(400).json({ message: 'Email is already in use' });
          return;
        }
      }

      // Handle optional password update
      let hashedPassword = existingUser.password;
      if (password && password.trim() !== '') {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(email && { email }),
          ...(password && password.trim() !== '' && { password: hashedPassword }),
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });

      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
