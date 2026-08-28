import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createProductSchema, updateProductSchema } from '@dorovu/shared';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const crafterStore = await prisma.crafterStore.findUnique({
      where: { crafterId: req.user!.userId },
    });

    if (!crafterStore) {
      res.status(404).json({ message: 'Crafter store not found' });
      return;
    }

    // Parse JSON fields from multipart/form-data
    const bodyData = { ...req.body };
    if (typeof bodyData.variants === 'string') {
      try { bodyData.variants = JSON.parse(bodyData.variants); } catch (e) {}
    }
    if (typeof bodyData.tags === 'string') {
      try { bodyData.tags = JSON.parse(bodyData.tags); } catch (e) {}
    }

    const validatedData = createProductSchema.parse(bodyData);

    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: Express.Multer.File) => {
        images.push(file.path);
      });
    }

    const product = await prisma.product.create({
      data: {
        crafterId: crafterStore.id,
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category,
        craftType: validatedData.craftType,
        tags: validatedData.tags,
        isCustomOrder: validatedData.isCustomOrder,
        leadTime: validatedData.leadTime,
        images: images,
        variants: {
          create: validatedData.variants.map((v) => ({
            name: v.name,
            stock: v.stock,
            priceAdjustment: v.priceAdjustment,
          }))
        }
      },
      include: {
        variants: true
      }
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error: any) {
    console.error('Create product error:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crafterId, search, category } = req.query;

    const where: any = {};
    
    if (crafterId) {
      where.crafterId = String(crafterId);
    }
    
    if (category) {
      where.category = String(category);
    }
    
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
        { tags: { has: String(search) } }
      ];
    }
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: limit } : {}),
      include: {
        crafter: {
          select: {
            storeName: true,
          }
        },
        variants: true
      }
    });

    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTrendingProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 4;
    
    const products = await prisma.product.findMany({
      orderBy: { totalSales: 'desc' },
      take: limit,
      include: {
        crafter: {
          select: {
            storeName: true,
          }
        },
        variants: true
      }
    });

    res.json({ products });
  } catch (error) {
    console.error('Get trending products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: String(req.params.id) },
      include: {
        crafter: {
          select: {
            storeName: true,
            description: true,
          }
        },
        variants: true
      }
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const crafterStore = await prisma.crafterStore.findUnique({
      where: { crafterId: req.user!.userId },
    });

    if (!crafterStore) {
      res.status(404).json({ message: 'Crafter store not found' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: String(req.params.id) },
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (product.crafterId !== crafterStore.id) {
      res.status(403).json({ message: 'Not authorized to update this product' });
      return;
    }

    const bodyData = { ...req.body };
    if (typeof bodyData.variants === 'string') {
      try { bodyData.variants = JSON.parse(bodyData.variants); } catch (e) {}
    }
    if (typeof bodyData.tags === 'string') {
      try { bodyData.tags = JSON.parse(bodyData.tags); } catch (e) {}
    }

    const validatedData = updateProductSchema.parse(bodyData);

    let images = [...product.images];
    
    // If the user wants to keep some existing images, they might send a JSON string of existing URLs
    // For now, any new files simply get appended to the existing ones (or replace if logic is strictly overwrite)
    // To support full replacement or merging, we need explicit instructions. For MVP, let's append new images.
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // If we want to replace entirely when new files are sent:
      // images = [];
      req.files.forEach((file: Express.Multer.File) => {
        images.push(file.path);
      });
    }

    // For variants update, the easiest is to delete existing and recreate, or strictly update
    // Since this is MVP, let's keep it simple: if variants are provided, delete old and create new.
    let variantsUpdate = {};
    if (validatedData.variants) {
      variantsUpdate = {
        deleteMany: {},
        create: validatedData.variants.map((v) => ({
          name: v.name,
          stock: v.stock,
          priceAdjustment: v.priceAdjustment,
        }))
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: String(req.params.id) },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category,
        craftType: validatedData.craftType,
        tags: validatedData.tags,
        isCustomOrder: validatedData.isCustomOrder,
        leadTime: validatedData.leadTime,
        images,
        variants: variantsUpdate
      },
      include: {
        variants: true
      }
    });

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error: any) {
    console.error('Update product error:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const crafterStore = await prisma.crafterStore.findUnique({
      where: { crafterId: req.user!.userId },
    });

    if (!crafterStore) {
      res.status(404).json({ message: 'Crafter store not found' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: String(req.params.id) },
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (product.crafterId !== crafterStore.id) {
      res.status(403).json({ message: 'Not authorized to delete this product' });
      return;
    }

    await prisma.product.delete({
      where: { id: String(req.params.id) },
    });
    
    // Note: In a production app, we should delete the image files here

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
