import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  image: z.string().url().optional(),
});

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    let imageUrl = validatedData.image;

    if (req.file) {
      imageUrl = req.file.path;
    }

    const category = await prisma.category.create({
      data: {
        ...validatedData,
        image: imageUrl,
      },
    });

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error: any) {
    console.error('Create category error:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Category name already exists' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const validatedData = createCategorySchema.parse(req.body);
    let imageUrl = validatedData.image;

    if (req.file) {
      imageUrl = req.file.path;
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...validatedData,
        ...(imageUrl && { image: imageUrl }), // only update if provided
      },
    });

    res.json({ message: 'Category updated successfully', category });
  } catch (error: any) {
    console.error('Update category error:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Category name already exists' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Delete category error:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
