import express from 'express';
import loginRoutes from './authRoutes/index.js';
import uploadRoutes from './uploadRoutes/index.js';

const router = express.Router();

router.use(loginRoutes);
router.use(uploadRoutes);

export default router;