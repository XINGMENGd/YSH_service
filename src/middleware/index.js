import compression from 'compression';
import cors from 'cors';
import express from 'express';
import adminApiRoutes from '../admin/index.js';
import commonApiRoutes from '../common/index.js';
import { imagePath, videoPath } from '../config/index.js';
import frontendApiRoutes from '../frontend/index.js';
import { relativePath } from '../utils/index.js';
import tokenAuth from './tokenAuth.js';

export function configureApp(app) {
  // app.use(compression()); // 开启gzip压缩
  app.use(cors()); // 配置跨域
  app.use(tokenAuth); // 配置token验证
  app.use(express.json()); // 配置解析 JSON 数据
  app.use(express.urlencoded({ extended: true })); // 配置解析 URL 编码表单数据
  app.use('/' + imagePath, express.static(relativePath(imagePath))) // 开放地址允许访问本地uploads文件夹
  app.use('/' + videoPath, express.static(relativePath(videoPath))) // 开放地址允许访问本地uploads文件夹

  app.use((req, res, next) => {
    const { originalUrl } = req;
    const prefixRegex = /^(\/adminApi|\/frontendApi)(\/.*)$/;
    const commonApiPrefix = '/commonApi';
    const match = originalUrl.match(prefixRegex);
    if (match) {
      const requestPath = match[2];
      const commonRoutes = ['/uploadFile', '/removeFiles', '/uploadChunks', '/mergeChunks']
      if (commonRoutes.includes(requestPath)) {
        req.url = `${commonApiPrefix}${requestPath}`;
      }
    }
    next();
  });
  app.use('/adminApi', adminApiRoutes) // 配置后台路由接口
  app.use('/frontendApi', frontendApiRoutes) // 配置前台路由接口
  app.use('/commonApi', commonApiRoutes) // 配置公共路由接口
}
