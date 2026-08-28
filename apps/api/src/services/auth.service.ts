import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import type { RegisterDTO, LoginDTO } from '@dorovu/shared';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const AuthService = {
  async register(data: RegisterDTO) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(400, 'User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
      },
    });

    const tokens = generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  },

  async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.password) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const tokens = generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        // crafterProfile: user.crafterProfile,
      },
      ...tokens,
    };
  },

  async googleAuth(idToken: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new AppError(400, 'Invalid Google token');
    }

    const { email, given_name, family_name, sub: googleId } = payload;

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId },
          { email }
        ]
      }
    });

    if (!user) {
      // Create new user if not found
      user = await prisma.user.create({
        data: {
          email,
          firstName: given_name || 'User',
          lastName: family_name || '',
          googleId,
        },
      });
    } else if (!user.googleId) {
      // Link Google ID if user logged in with email before
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    }

    const tokens = generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }
};
