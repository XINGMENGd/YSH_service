import jwt from 'jsonwebtoken';
import connection from '../config/mysql/index.js'
import { secretKey } from '../config/index.js'

export default async function createdToken(userInfo, expires = '1d', callback) {
  const { id: userId, jurisdiction: roles } = userInfo
  const token = jwt.sign({ userId }, secretKey, { expiresIn: expires });

  // 计算Token的过期时间
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 8) // 加8小时匹配中国北京时间
  expiresAt.setDate(expiresAt.getDate() + Number(expires.slice(0, -1)))
  const formattedDate = expiresAt.toISOString().slice(0, 19).replace('T', ' ');

  // 将Token、当前用户ID和过期时间存储到数据库
  connection.query(
    `INSERT INTO auth_tokens
     ( token, user_id, expires_at, roles)
      VALUES
     ( '${token}', ${userId}, '${formattedDate}', '${roles}')`,
    (error, results) => {
      if (error) {
        return callback(error)
      }
      // 验证通过，生成 Token
      callback(null, { token, expires_at: formattedDate })
    }
  )
}