import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const createCraftTypeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

export const getCraftTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const craftTypes = await prisma.craftType.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ craftTypes });
  } catch (error) {
    console.error('Get craft types error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCraftType = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createCraftTypeSchema.parse(req.body);

    const craftType = await prisma.craftType.create({
      data: validatedData,
    });

    res.status(201).json({ message: 'Craft Type created successfully', craftType });
  } catch (error: any) {
    console.error('Create craft type error:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Craft Type name already exists' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCraftType = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const validatedData = createCraftTypeSchema.parse(req.body);

    const craftType = await prisma.craftType.update({
      where: { id },
      data: validatedData,
    });

    res.json({ message: 'Craft Type updated successfully', craftType });
  } catch (error: any) {
    console.error('Update craft type error:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Craft Type not found' });
      return;
    }
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Craft Type name already exists' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCraftType = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    await prisma.craftType.delete({
      where: { id },
    });

    res.json({ message: 'Craft Type deleted successfully' });
  } catch (error: any) {
    console.error('Delete craft type error:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Craft Type not found' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
