import express from 'express'
import multerConfig from '../../utils/multerConfig.js'
import connection from '../../config/mysql/index.js'

// 上传到服务器地址
const BaseURL = 'http://localhost:3001' 
// 上传到服务器的目录
const imgPath = '/uploads/'

const router = express.Router()

router.post('/upload', (req, res) => {
  multerConfig.single('file')(req, res, function (err) {
    if (err) {
      // 传递的图片格式错误或者超出文件限制大小，就会reject出去
      console.log(err);
      res.json(err)
    } else {
      // 拼接成完整的服务器静态资源图片路径
      console.log(BaseURL + imgPath + req.file.filename)
    }
  })

})

export default router