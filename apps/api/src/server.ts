import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import crafterRoutes from './routes/crafter.routes';
import adminRoutes from './routes/admin.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import craftTypeRoutes from './routes/craft-type.routes';
import orderRoutes from './routes/order.routes';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve static files from the public directory
import path from 'path';
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/crafters', crafterRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/craft-types', craftTypeRoutes);
app.use('/api/v1/orders', orderRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
