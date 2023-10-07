import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { systemConfig } from './config/index.js';
import { tokenAuth } from './middleware/index.js';
import { relativePath } from './utils/index.js'
import adminApiRoutes from './admin/index.js';
import frontendApiRoutes from './frontend/index.js';
import commonApiRoutes from './common/index.js';

const app = express()

// app.use(compression()); // 压缩
app.use(cors()); // 配置跨域
app.use(express.json()); // 配置解析 JSON 数据
app.use(express.urlencoded({ extended: true })); // 配置解析 URL 编码表单数据
app.use(tokenAuth); // 配置token验证

// 开放 /uploads 地址访问本地uploads文件夹
// app.use('/uploads/images', express.static(join(dirname(fileURLToPath(import.meta.url)), '../uploads/images'))) // 静态文件夹的相对路径
app.use('/uploads/images', express.static(relativePath('/uploads/images'))) // 静态文件夹的相对路径

app.use((req, res, next) => {
  const { originalUrl } = req;
  const prefixRegex = /^(\/adminApi|\/frontendApi)(\/.*)$/;
  const commonApiPrefix = '/commonApi';

  const match = originalUrl.match(prefixRegex);
  if (match) {
    const requestPath = match[2];
    const commonRoutes = ['/uploadImage', '/removeImages']
    if (commonRoutes.includes(requestPath)) {
      req.url = `${commonApiPrefix}${requestPath}`;
    }
  }
  next();
});

app.use('/adminApi', adminApiRoutes) // 配置后台路由接口
app.use('/frontendApi', frontendApiRoutes) // 配置前台路由接口
app.use('/commonApi', commonApiRoutes) // 配置公共路由接口

app.listen(systemConfig.port, () => {
  console.log(`Server started on port ${systemConfig.port}`);
});