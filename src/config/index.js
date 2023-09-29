import crypto from 'crypto'

export const systemConfig = {
  port: 8003
};
// 上传到服务器地址
export const BaseURL = 'http://localhost:8003'
// 上传到服务器的目录
export const imgPath = '/uploads/images/'

// export const secretKey = crypto.randomBytes(32).toString('hex')
export const secretKey = 'dbed41b482529396c696d6b34e1abb9d275390d4aaaf41cf2f655333f3c81619'