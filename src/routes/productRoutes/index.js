import express from 'express'
import { fetchProductController, createProductController } from '../../controllers/productController.js';

const router = express.Router()

// 新增商品 
router.get('/fetchProduct', fetchProductController)

// 新增商品 
router.post('/createProduct', createProductController)

export default router