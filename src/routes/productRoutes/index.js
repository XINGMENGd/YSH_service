import express from 'express'
import { getProductListController, getProductCategoryListController, getProductStatusListController, createProductController, updateProductController } from '../../controllers/productController.js';

const router = express.Router()

router.get('/getProductList', getProductListController) // 获取商品列表
router.get('/getProductCategoryList', getProductCategoryListController) // 获取商品分类列表
router.get('/getProductStatusList', getProductStatusListController) // 获取商品状态列表
router.post('/createProduct', createProductController) // 新增商品 
router.post('/updateProduct', updateProductController) // 修改商品信息

export default router