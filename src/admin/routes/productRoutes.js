import express from 'express'
import * as productController from '../controllers/productController.js';

const router = express.Router()

const routesController = Object.keys(productController)
for (const item of routesController) {
  const routeName = item.replace('Controller', '');
  if (productController[item].method == 'get') {
    router.get(`/${routeName}`, productController[item].handler)
  } else if (productController[item].method == 'post') {
    router.post(`/${routeName}`, productController[item].handler)
  }
}

export default router