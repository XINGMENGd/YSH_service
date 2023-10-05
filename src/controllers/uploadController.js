import multerConfig from '../utils/multerConfig.js'
import fs from 'fs'
import { BaseURL, imgPath } from '../config/index.js'
import { relativePath } from '../utils/index.js'
import crypto from 'crypto'

// 上传图片的逻辑控制器
export const uploadController = async (req, res) => {
  multerConfig.single('file')(req, res, function (err) {

    if (err) {
      // 传递的图片格式错误或者超出文件限制大小，响应错误信息
      res.json(err)
    } else {
      // 拼接成完整的服务器静态资源图片路径
      const fileFormat = req.file.originalname.split('.')
      // 自定义图片名称
      const extension = fileFormat[fileFormat.length - 1]; // 图片后缀
      const hash = crypto.createHash('sha256').update(req.file.originalname).digest('hex'); // 对图片名进行hash转换
      const newFileName = hash + '.' + extension;
      res.json({
        code: 200, message: '上传成功！',
        data: {
          img_url: BaseURL + imgPath + newFileName
        }
      })
    }
  })
}

// 删除图片的逻辑控制器
export const removeImagesController = async (req, res) => {
  const { deletedArray } = req.body
  const baseUrl = relativePath('/uploads/images/')
  try {
    await deletedArray.forEach(item => {
      fs.unlinkSync(baseUrl + item)
    })
    res.json({
      code: 200, message: "删除成功", data: null
    })
  } catch (err) {
    res.json({
      code: 100, message: "图片不存在", data: null
    })
  }
}
