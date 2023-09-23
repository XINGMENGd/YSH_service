import express from 'express';
import authRoutes from './authRoutes/index.js';
import productRoutes from './productRoutes/index.js';
import uploadRoutes from './uploadRoutes/index.js';

const router = express.Router();

router.use(authRoutes);
router.use(productRoutes);
router.use(uploadRoutes);

export default router;