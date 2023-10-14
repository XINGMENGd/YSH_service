import express from 'express';
import uploadRoutes from './routes/uploadRoutes.js';

const router = express.Router();

router.use(uploadRoutes);

export default router;