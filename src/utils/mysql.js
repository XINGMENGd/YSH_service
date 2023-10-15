import mysql from 'mysql';
import mysqlConfig from '../config/mysql.js';

function dbSql(sql, data = null) {
  return new Promise((resolve, reject) => {
    // 创建连接对象
    const connection = mysql.createConnection(mysqlConfig);
    // 连接到MySQL服务器
    connection.connect(err => {
      if (err) return console.error('数据库连接失败', err) // 数据库连接错误，抛出错误信息
    });

    // 执行sql
    connection.query(sql, data, (err, result) => {
      // 关闭数据库连接
      connection.end()
      if (err) return reject(err)
      resolve(result)
    })
  })
}

export default dbSql