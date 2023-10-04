import { getProductList, getProductStatusList, getProductCategoryList, createProduct, updateProduct } from '../models/productModel.js';
import moment from 'moment/moment.js';
import { BaseURL, imgPath } from '../config/index.js'

// 查询商品列表的逻辑控制器
export const getProductListController = async (req, res) => {
  let response = { code: 0, message: '', data: null }

  await getProductList(req.query)
    .then(data => {
      data = data.map(item => {
        item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
        item.updated_at ? item.updated_at = moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss') : ''
        item.imageArray ? item.imageArray = item.imageArray.split(',').map(filename => BaseURL + imgPath + filename) : item.imageArray = []
        return item
      })
      response = {
        code: 200, message: '获取成功',
        data: {
          list: data,
          total: data[0]?.total_rows || null
        }
      }
      res.json(response);
    })
    .catch(error => {
      response.code = 100, response.message = '获取失败', response.data = error
      res.json(response);
    })
};

// 查询商品分类列表的逻辑控制器
export const getProductCategoryListController = async (req, res) => {
  let response = { code: 0, message: '', data: null }

  await getProductCategoryList()
    .then(data => {
      response.code = 200, response.message = '获取成功', response.data = data
      res.json(response);
    })
    .catch(error => {
      response.code = 100, response.message = 'error', response.data = error
      res.json(response);
    })
};

// 查询商品状态列表的逻辑控制器
export const getProductStatusListController = async (req, res) => {
  let response = { code: 0, message: '', data: null }

  await getProductStatusList()
    .then(data => {
      response.code = 200, response.message = '获取成功', response.data = data
      res.json(response);
    })
    .catch(error => {
      response.code = 100, response.message = 'error', response.data = error
      res.json(response);
    })
};

// 添加商品的逻辑控制器
export const createProductController = async (req, res) => {
  let response = { code: 0, message: '', data: null }

  await createProduct(req.body)
    .then(data => {
      response.code = 200, response.message = '添加商品成功'
      res.json(response);
    })
    .catch(error => {
      response.code = 100, response.message = '添加商品失败', response.data = error
      res.json(response);
    })
};

// 更新商品信息的逻辑控制器
export const updateProductController = async (req, res) => {
  let response = { code: 0, message: '', data: null }

  await updateProduct(req.body)
    .then(data => {
      response.code = 200, response.message = '修改成功'
      res.json(response);
    })
    .catch(error => {
      response.code = 100, response.message = '修改失败', response.data = error
      res.json(response);
    })
};