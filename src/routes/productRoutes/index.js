import express from 'express'
import { fetchProductController, createProductController, updateProductController } from '../../controllers/productController.js';

const router = express.Router()

router.get('/fetchProduct', fetchProductController) // 新增商品 
router.post('/createProduct', createProductController) // 新增商品 
router.post('/updateProduct', updateProductController) // 修改商品

export default router