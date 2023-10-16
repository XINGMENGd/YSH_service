import mysql from 'mysql';
import mysqlConfig from '../config/mysql.js';

// 创建连接池
const pool = mysql.createPool(mysqlConfig);

// db 是 Database 的缩写，表示数据库
function dbSql(sql, data = null) {
  return new Promise((resolve, reject) => {
    // 从连接池中获取连接
    pool.getConnection((error, connection) => {
      if (error) return reject(error) // 获取连接出现错误
      // 执行sql
      connection.query(sql, data, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
        // 释放连接对象(放回连接池)
        connection.release()
      })
    })
  })
}

export default dbSql