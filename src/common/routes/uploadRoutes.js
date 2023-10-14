import express from 'express';
import * as uploadController from '../controllers/uploadController.js';

const router = express.Router()

const routesController = Object.keys(uploadController)
for (const item of routesController) {
  const routeName = item.replace('Controller', '');
  if (uploadController[item].method == 'get') {
    router.get(`/${routeName}`, uploadController[item].handler)
  } else if (uploadController[item].method == 'post') {
    router.post(`/${routeName}`, uploadController[item].handler)
  }
}

export default router