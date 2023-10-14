import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router()

const routesController = Object.keys(authController)
for (const item of routesController) {
  const routeName = item.replace('Controller', '');
  if (authController[item].method == 'get') {
    router.get(`/${routeName}`, authController[item].handler)
  } else if (authController[item].method == 'post') {
    router.post(`/${routeName}`, authController[item].handler)
  }
}

export default router