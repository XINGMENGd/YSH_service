import app from '../app.js'
import connection from '../config/mysql/index.js'

import { MapTree } from '../utils/index.js'
// 用户登录
app.post('/node/login', function (req, res) {
  let response = { code: 0 }
  connection.query(
    'select * from users',
    (err, data) => {
      const userInfo = data.find((item) => req.body.username == item.username && req.body.password == item.password)
      if (userInfo) {
        response = {
          code: 200,
          data: {
            token: userInfo.username == 'admin' ? '64000019741229721X' : '64000019741229721Y',
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

// 查询路由数据 
app.post('/node/FetchRouteList', function (req, res) {
  const roles = req.headers.authorization.slice(-1) == 'X' ? '01' : '02'
  connection.query(
    `SELECT * FROM route_menu WHERE roles LIKE '%${roles}%'`,
    (err, data) => {
      if (data) {
        const newList = MapTree(data)
        res.json(newList)
      } else {
        res.json(err)
      }
    })
})

export default app