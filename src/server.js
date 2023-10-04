import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { systemConfig } from './config/index.js';
import apiRoutes from './routes/index.js';
import { tokenAuth } from './middleware/index.js';
import { relativePath } from './utils/index.js'

const app = express()

// app.use(compression()); // 压缩
app.use(cors()); // 配置跨域
app.use(express.json()); // 配置解析 JSON 数据
app.use(express.urlencoded({ extended: true })); // 配置解析 URL 编码表单数据
app.use(tokenAuth); // 配置token验证

// 开放 /uploads 地址访问本地uploads文件夹
// app.use('/uploads/images', express.static(join(dirname(fileURLToPath(import.meta.url)), '../uploads/images'))) // 静态文件夹的相对路径
app.use('/uploads/images', express.static(relativePath('/uploads/images'))) // 静态文件夹的相对路径
app.use('/api', apiRoutes) // 配置路由接口


app.listen(systemConfig.port, () => {
  console.log(`Server started on port ${systemConfig.port}`);
});