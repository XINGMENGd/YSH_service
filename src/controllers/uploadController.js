import multerConfig from '../utils/multerConfig.js'

// 上传到服务器地址
const BaseURL = 'http://localhost:8003'
// 上传到服务器的目录
const imgPath = '/public/'

// 用户的逻辑控制器
export const uploadController = async (req, res) => {
  multerConfig.single('file')(req, res, function (err) {
    if (err) {
      // 传递的图片格式错误或者超出文件限制大小，响应错误信息
      res.json(err)
    } else {
      // 拼接成完整的服务器静态资源图片路径
      res.json({
        code: 200, message: '上传成功！',
        data: { img_url: BaseURL + imgPath + req.file.filename }
      })
    }
  })
}
