import { fetchProduct, createProduct } from '../models/productModel.js';

// 查询商品列表
export const fetchProductController = (req, res) => {
  let response = { code: 0, message: '', data: null }

  fetchProduct(req.query, (error, data) => {
    if (data) {
      response.code = 200, response.message = '获取成功', response.data = data
      res.json(response);
    } else {
      response.code = 100, response.message = 'error', response.data = error
      res.json(response);
    }
  });
};

// 添加商品
export const createProductController = (req, res) => {
  let response = { code: 0, message: '', data: null }

  createProduct(req.body, (error, data) => {
    if (data) {
      response.code = 200, response.message = '添加商品成功'
      res.json(response);
    } else {
      response.code = 100, response.message = '添加商品失败', response.data = error
      res.json(response);
    }
  });
};