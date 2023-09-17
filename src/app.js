import bodyParse from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import express from 'express';

const app = express()
// 引入跨域插件
// 解决跨域
// app.use(cors());

/*中间件*/

// 压缩
// app.use(compression());

// 请求解析json
app.use(bodyParse.json());

//将文件部署到服务器
// app.use(express.static('img'))

// 解析post请求数据
app.use(bodyParse.urlencoded({ extended: false }));

//配置解析表单数据(application/x-www-form-urlencoded)格式的中间件
// app.use(express.urlencoded({ extended: false }))

export default app;