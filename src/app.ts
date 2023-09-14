import bodyParse from 'body-parser';
import express from 'express';
import cors from 'cors';
import { NextFunction, Request, Response } from 'express';
import compression from 'compression';

import connection from './config/mysql/index'

const app = express();

// 3. 连接到MySQL服务器
connection.connect((err: any) => {
  // 如果有错误对象，表示连接失败
  if (err) return console.log('数据库连接失败')
  // 没有错误对象提示连接成功
  console.log('mysql数据库连接成功')
});

app.get('/node/mysql', function (req: Request, res: Response) {
  connection.query(
    'select * from route_menu',
    (err: any, data: any) => {
      console.log(data, 123);

      if (data) {
        const list = data.map((item: any, index: any) => {

          return item
          // console.log(item.children.split(','));
          // }
          // console.log(item);
          // if (item.children == item.name) {
          //   console.log(item)
          // };
          // return arr
        })
        res.json(list)
      } else {
        res.json(err)
      }
    })
  // connection.end()
})

// 引入跨域插件
// 解决跨域
// app.use(cors());

// // 手动覆盖cors跨域默认设置
// const whitelist = ['http://127.0.0.1:8080', 'http://localhost:8080']
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials: true
// }
// app.use(cors(corsOptions));

/*中间件*/

// 压缩
// app.use(compression());

// 请求解析json
app.use(bodyParse.json());
// 请求解析formData
// app.use(bodyParse.urlencoded());


/* 路由 */
app.post('/node/test', function (req: Request, res: Response) {
  res.json({
    hello: 'www'
  });
});

const RouteHouse = [
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: "Layout",
  //   meta: { title: 'test', hidden: false, jurisdiction: ['00', '01'] },
  //   children: [
  //     {
  //       path: 'test1',
  //       name: 'test1',
  //       component: 'test1',
  //       meta: { title: 'test1', hidden: false }
  //     }
  //   ]
  // },
  // {
  //   path: '/demo',
  //   name: 'demo',
  //   component: "Layout",
  //   meta: { title: 'demo', hidden: false, jurisdiction: ['00', '01'] },
  //   children: [
  //     {
  //       path: 'demo1',
  //       name: 'demo1',
  //       component: 'demo1',
  //       meta: { title: 'demo1页面', hidden: false }
  //     },
  //     {
  //       path: 'demo2',
  //       name: 'demo2',
  //       component: 'demo2',
  //       meta: { title: 'demo2页面', hidden: false }
  //     }
  //   ]
  // },
  {
    path: '/menu',
    name: 'menu',
    component: "Layout",
    meta: { title: 'menu', hidden: false, jurisdiction: ['00'] },
    children: [
      {
        path: 'menu1',
        name: 'menu1',
        meta: { title: 'menu1', hidden: false },
        children: [
          {
            path: 'menu1-1',
            name: 'menu1-1',
            component: 'menu1-1',
            meta: { title: 'menu1-1页面', hidden: false }
          },
          {
            path: 'menu1-2',
            name: 'menu1-2',
            component: 'menu1-2',
            meta: { title: 'menu1-2页面', hidden: false }
          }
        ]
      },
      {
        path: 'menu2',
        name: 'menu2',
        component: 'menu2',
        meta: { title: 'menu2页面', hidden: false }
      }
    ]
  },
]

app.post('/node/login', function (req: Request, res: Response) {
  let response: any = { code: 0 }
  connection.query(
    'select * from users',
    (err: any, data: any) => {
      const userInfo = data.find((item: any) => req.body.username == item.username && req.body.password == item.password)
      if (userInfo) {
        response = {
          code: 200,
          data: {
            token: "64000019741229721X",
            username: userInfo.username,
            jurisdiction: userInfo.jurisdiction
          }
        }
      } else {
        response = {
          code: 100,
          message: "请输入正确的账号与密码"
        }
      }
      res.json(response)
    })
})

app.post('/node/RouteList', function (req: Request, res: Response) {
  const { jurisdiction } = req.body
  let response: any[] = []
  RouteHouse.filter(item => {
    if (item.meta.jurisdiction.includes(jurisdiction)) {
      response.push(item)
    }
  })
  return res.json({
    code: 200,
    data: response
  })
})

export default app;