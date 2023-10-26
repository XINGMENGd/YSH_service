import _ from 'lodash';
import moment from 'moment/moment.js';
import { BaseURL, imagePath, responseConfig, videoPath } from '../../config/index.js';
import * as productModel from '../models/productModel.js';

// 获取商品列表的逻辑控制器
export const getProductListController = {
  method: 'get',
  handler: async (req, res) => {
    const response = _.cloneDeep(responseConfig);
    try {
      const { data: _data, total_rows } = await productModel.getProductList(req.query)
      const list = _data.map(item => {
        const { videoFiles, buyer_id, imageFiles, ...product_info } = item
        product_info.created_at = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
        product_info.updated_at = product_info.updated_at ? moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss') : ''
        product_info.cover_image = BaseURL + imagePath + JSON.parse(imageFiles)[0].name
        return product_info
      })
      response.message = '获取成功';
      response.data = {
        list,
        total: total_rows || null
      }
      res.json(response);
    } catch (error) {
      console.error(error);
      response.message = '获取失败';
      res.set('response-status', 'error')
      res.json(response);
    }
  }
}