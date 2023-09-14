// 由于四项（insert,delete,update,select）操作只是sql语句不同

// 1. 加载mysql
const mysql = require('mysql');
// 2. 创建连接对象
const connection = mysql.createConnection({
  host: 'localhost',       // 连接数据库服务器地址
  port: 3306,              // 端口号
  user: 'root',            // 连接数据库服务器需要的用户名
  password: '$MaN2031/',   // 连接数据库服务器需要的密码
  database: 'vue3_back'         // 所要连接的数据库名字
});
// 3. 连接到MySQL服务器
connection.connect((err: any) => {
  // 如果有错误对象，表示连接失败
  if (err) return console.log('数据库连接失败')
  // 没有错误对象提示连接成功
  console.log('mysql数据库连接成功')
});

export default connection
