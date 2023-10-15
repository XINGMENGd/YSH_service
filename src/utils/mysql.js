import mysql from 'mysql';
import mysqlConfig from '../config/mysql.js';

// 创建连接对象
const connection = mysql.createConnection(mysqlConfig);

// 连接到MySQL服务器
connection.connect(err => {
  // 如果有错误对象，表示连接失败
  if (err) return console.log('数据库连接失败', err)
  // 没有错误对象提示连接成功
  console.log('mysql数据库连接成功')
});

export default connection 