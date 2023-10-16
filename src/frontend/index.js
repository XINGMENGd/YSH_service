import express from 'express';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

const router = express.Router();

router.use(authRoutes);
router.use(productRoutes);

export default router;