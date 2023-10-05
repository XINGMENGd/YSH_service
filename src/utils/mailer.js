import nodemailer from 'nodemailer'
import { mailConfig } from '../config/index.js'
import { relativePath } from '../utils/index.js'
import fs from 'fs'

// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(mailConfig)

// 发送邮件
export function sendVerifyCode(verify_code, email) {
  return new Promise((resolve, reject) => {
    const url = relativePath('/src/views/emailTemplate.html')
    
    fs.readFile(url, 'utf8', (error, content) => {
      if (error) {
        return reject(error)
      } else {
        const emailContent = content.replace('{{verify_code}}', verify_code);
        const mail = {
          from: `"芸尚惠服务"<w379890959@163.com>`, // 发件人
          subject: '邮箱验证码', // 邮箱主题
          to: email, // 收件人，这里由post请求传递过来
          html: emailContent
        };
        transporter.sendMail(mail, (error, info) => {
          if (error) {
            reject(error)
          } else {
            resolve(info)
          }
        })
      }
    })
  })
}
