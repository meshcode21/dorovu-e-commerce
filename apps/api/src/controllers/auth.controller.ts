import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginSchema, RegisterSchema } from '@dorovu/shared';
import { z } from 'zod';

const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = RegisterSchema.parse(req.body);
      const result = await AuthService.register(data);
      
      setCookies(res, result.accessToken, result.refreshToken);
      
      res.status(201).json({ user: result.user });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = LoginSchema.parse(req.body);
      const result = await AuthService.login(data);
      
      setCookies(res, result.accessToken, result.refreshToken);
      
      res.status(200).json({ user: result.user });
    } catch (error) {
      next(error);
    }
  },

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({ idToken: z.string() });
      const { idToken } = schema.parse(req.body);
      
      const result = await AuthService.googleAuth(idToken);
      
      setCookies(res, result.accessToken, result.refreshToken);
      
      res.status(200).json({ user: result.user });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await AuthService.getMe(userId);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },
};
