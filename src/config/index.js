export const systemConfig = {
  port: 8003
};
// 邮箱发送信息配置
export const mailConfig = {
  service: '163', // 类型163网易邮箱
  port: 465, // 默认端口
  secure: true,
  auth: {
    user: 'w379890959@163.com', // 注册的163邮箱账号
    pass: "GGAUOOUNTAXKGXRJ" // 邮箱的授权码，不是注册时的密码,等你开启的stmp服务自然就会知道了
  }
}
// 上传到服务器地址
export const BaseURL = 'http://localhost:8003'
// 上传到服务器的目录
export const imgPath = '/uploads/images/'

export const secretKey = 'dbed41b482529396c696d6b34e1abb9d275390d4aaaf41cf2f655333f3c81619'