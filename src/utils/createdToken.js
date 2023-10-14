import jwt from 'jsonwebtoken';
import moment from 'moment/moment.js';
import { secretKey } from '../config/index.js';

export default async function createdToken(userInfo, expires = '24h', callback) {
  const { id: userId, roles } = userInfo
  try {
    const token = jwt.sign({ userId, roles }, secretKey, { expiresIn: expires });
    // 计算Token的过期时间
    const reg = /\b(\d+)([dhm])\b/
    const [, number, hourly_basis] = expires.match(reg)
    const formattedDate = moment().add(number, hourly_basis).format('YYYY-MM-DD HH:mm:ss')
    callback(null, { token, expires_at: formattedDate })
  } catch (error) {
    console.log(error);
    callback(error)
  }
}