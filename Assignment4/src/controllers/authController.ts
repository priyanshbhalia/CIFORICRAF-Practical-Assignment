import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestError('Email is already registered.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'tree_monitoring_secret_key_2026_super_secure';
    const jwtExpires = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: jwtExpires as any,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'tree_monitoring_secret_key_2026_super_secure';
    const jwtExpires = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: jwtExpires as any,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};
