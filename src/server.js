import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { systemConfig } from './config/index.js';
import apiRoutes from './routes/index.js';
import { tokenAuth } from './middleware/index.js';

const app = express()

// app.use(compression()); // 压缩

app.use(cors()); // 配置跨域
app.use(express.json()); // 配置解析 JSON 数据
app.use(express.urlencoded({ extended: true })); // 配置解析 URL 编码表单数据
// app.use(express.static('img'))； //将文件部署到服务器
app.use(tokenAuth); // 配置token验证

app.use('/api', apiRoutes)

app.listen(systemConfig.port, () => {
  console.log(`Server started on port ${systemConfig.port}`);
});