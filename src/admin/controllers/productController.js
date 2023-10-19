import _ from 'lodash';
import moment from 'moment/moment.js';
import { BaseURL, imagePath, responseConfig, videoPath } from '../../config/index.js';
import { productStrategies, validate } from '../../utils/validate.js';
import * as productModel from '../models/productModel.js';

// 查询商品列表的逻辑控制器
export const getProductListController = {
  method: 'get',
  handler: async (req, res) => {
    const response = _.cloneDeep(responseConfig);
    try {
      const { data, total_rows } = await productModel.getProductList(req.query)
      const list = data.map(item => {
        item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
        item.updated_at ? item.updated_at = moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss') : ''
        item.imageFiles = JSON.parse(item.imageFiles).map(file => {
          file.name = BaseURL + imagePath + file.name
          file.type = file.type
          return file
        })
        item.videoFiles = JSON.parse(item.videoFiles).map(file => {
          file.name = BaseURL + videoPath + file.name
          file.type = file.type
          return file
        })
        return item
      })
      response.message = '获取成功';
      response.data = {
        list: list,
        total: total_rows || null
      };
      res.json(response);
    } catch (error) {
      console.error(error);
      response.message = '获取失败'; response.data = error;
      res.json(response);
    }
  }
}

// 查询商品分类列表的逻辑控制器
export const getProductCategoryListController = {
  method: 'get',
  handler: async (req, res) => {
    const response = _.cloneDeep(responseConfig);
    try {
      const data = await productModel.getProductCategoryList()
      response.message = '获取成功'; response.data = data;
      res.json(response);
    } catch (error) {
      console.error(error);
      response.message = 'error'; response.data = error;
      res.json(response);
    }
  }
}

// 查询商品状态列表的逻辑控制器
export const getProductStatusListController = {
  method: 'get',
  handler: async (req, res) => {
    const response = _.cloneDeep(responseConfig);
    try {
      const data = await productModel.getProductStatusList()
      response.message = '获取成功'; response.data = data
      res.json(response);
    } catch (error) {
      console.error(error);
      response.message = 'error'; response.data = error;
      res.json(response);
    }
  }
}

// 添加商品的逻辑控制器
export const createProductController = {
  method: 'post',
  handler: async (req, res) => {
    const response = _.cloneDeep(responseConfig);
    const { imageFiles, videoFiles } = req.body
    const errorMessage = validate(req.body, productStrategies)
    if (errorMessage) {
      response.code = 400, response.message = errorMessage
      return res.json(response)
    }
    req.body.imageFiles = JSON.stringify(imageFiles)
    req.body.videoFiles = JSON.stringify(videoFiles)
    try {
      await productModel.createProduct(req.body)
      response.message = '添加商品成功'
      res.json(response);
    } catch (error) {
      console.error(error);
      response.message = '添加商品失败'; response.data = error;
      res.json(response);
    }
  }
}

// 更新商品信息的逻辑控制器
export const updateProductController = {
  method: 'post',
  handler: async (req, res) => {
    const response = _.cloneDeep(responseConfig);
    const { imageFiles, videoFiles } = req.body
    const errorMessage = validate(req.body, productStrategies)
    if (errorMessage) {
      response.code = 400, response.message = errorMessage
      return res.json(response)
    }
    req.body.imageFiles = JSON.stringify(imageFiles)
    req.body.videoFiles = JSON.stringify(videoFiles)
    try {
      await productModel.updateProduct(req.body)
      response.message = '修改成功';
      res.json(response);
    } catch (error) {
      console.error(error);
      response.message = '修改失败'; response.data = error;
      res.json(response);
    }
  }
}