import { fetchProduct, createProduct, updateProduct } from '../models/productModel.js';
import moment from 'moment/moment.js';
import { BaseURL, imgPath } from '../config/index.js'

// 查询商品列表
export const fetchProductController = (req, res) => {
  let response = { code: 0, message: '', data: null }

  fetchProduct(req.query, (error, data) => {
    if (data) {
      data = data.map(item => {
        item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
        item.updated_at = moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss')
        item.imageArray ? item.imageArray = item.imageArray.split(',').map(filename => BaseURL + imgPath + filename) : item.imageArray = []
        return item
      })
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

// 更新商品信息
export const updateProductController = (req, res) => {
  let response = { code: 0, message: '', data: null }

  updateProduct(req.body, (error, data) => {
    if (data) {
      response.code = 200, response.message = '修改成功'
      res.json(response);
    } else {
      response.code = 100, response.message = '修改失败', response.data = error
      res.json(response);
    }
  });
};