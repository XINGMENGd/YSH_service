import moment from 'moment/moment.js';
import { BaseURL, imagePath, responseConfig, videoPath } from '../../config/index.js';
import { createProduct, getProductCategoryList, getProductList, getProductStatusList, updateProduct } from '../models/productModel.js';
import { validateObject, productObjectStrategies } from '../../utils/validate.js'
import _ from 'lodash';

// 深拷贝response对象，确保每个接口使用的是独立的response对象
const response = _.cloneDeep(responseConfig);
// 查询商品列表的逻辑控制器
export const getProductListController = {
  method: 'get',
  handler: (req, res) => {
    getProductList(req.query)
      .then(data => {
        data = data.map(item => {
          item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
          item.updated_at ? item.updated_at = moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss') : ''
          const imageFiles = JSON.parse(item.imageFiles).map(file => {
            file.fileName = BaseURL + imagePath + file.fileName
            file.fileType = file.fileType
            return file
          })
          item.imageFiles = imageFiles
          if (item.videoFiles) {
            const videoFiles = JSON.parse(item.videoFiles).map(file => {
              file.fileName = BaseURL + videoPath + file.fileName
              file.fileType = file.fileType
              return file
            })
            item.videoFiles = videoFiles
          } else {
            item.videoFiles = []
          }
          return item
        })
        response.message = '获取成功'
        response.data = {
          list: data,
          total: data[0]?.total_rows || null
        }
        res.json(response);
      })
      .catch(error => {
        console.log(error);
        response.message = '获取失败', response.data = error
        res.json(response);
      })
  }
}

// 查询商品分类列表的逻辑控制器
export const getProductCategoryListController = {
  method: 'get',
  handler: (req, res) => {
    getProductCategoryList()
      .then(data => {
        response.message = '获取成功', response.data = data
        res.json(response);
      })
      .catch(error => {
        response.message = 'error', response.data = error
        res.json(response);
      })
  }
}

// 查询商品状态列表的逻辑控制器
export const getProductStatusListController = {
  method: 'get',
  handler: (req, res) => {
    getProductStatusList()
      .then(data => {
        response.message = '获取成功', response.data = data
        res.json(response);
      })
      .catch(error => {
        response.message = 'error', response.data = error
        res.json(response);
      })
  }
}

// 添加商品的逻辑控制器
export const createProductController = {
  method: 'post',
  handler: (req, res) => {
    const { imageFiles, videoFiles } = req.body
    const errorMessage = validateObject(req.body, productObjectStrategies)
    if (errorMessage) {
      clonedResponse.message = errorMessage
      return res.json(clonedResponse)
    }
    req.body.imageFiles = JSON.stringify(imageFiles)
    req.body.videoFiles = JSON.stringify(videoFiles)
    createProduct(req.body)
      .then(data => {
        response.message = '添加商品成功'
        res.json(response);
      })
      .catch(error => {
        response.message = '添加商品失败', response.data = error
        res.json(response);
      })
  }
}

// 更新商品信息的逻辑控制器
export const updateProductController = {
  method: 'post',
  handler: (req, res) => {
    updateProduct(req.body)
      .then(data => {
        response.message = '修改成功'
        res.json(response);
      })
      .catch(error => {
        response.message = '修改失败', response.data = error
        res.json(response);
      })
  }
}