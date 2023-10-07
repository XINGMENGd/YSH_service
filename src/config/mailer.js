// 邮箱发送信息配置
const mailConfig = {
  service: '163', // 类型163网易邮箱
  port: 465, // 默认端口
  secure: true,
  auth: {
    user: 'w379890959@163.com', // 注册的163邮箱账号
    pass: "GGAUOOUNTAXKGXRJ" // 邮箱的授权码，不是注册时的密码,等你开启的stmp服务自然就会知道了
  }
}

export default mailConfig