import express from 'express';
import loginRoutes from './auth/index.js';
import uploadRoutes from './upload/index.js';

const router = express.Router();

router.use(loginRoutes);
router.use(uploadRoutes);

export default router;