import multer from "multer";
import fs from "fs";
import crypto from 'crypto'

let uploadFolder = 'uploads/images'; // 设定存储文件夹为根目录下的 upload 文件夹
// 设置文件上传存储路径
fs.mkdirSync(uploadFolder, {
  recursive: true // recursive 使用递归创建目录，如果父目录不存在会先创建
});

// 3. 设置 multer 的配置对象
const storage = multer.diskStorage({
  // 3.1 存储路径
  destination: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
      cb(null, uploadFolder)
    } else {
      cb({ error: '仅支持 jpg/png/gif 格式的图片！' })
    }
  },
  //  3.2 存储名称
  filename: function (req, file, cb) {
    // 将图片名称分割伪数组，用于截取图片的后缀
    const fileFormat = file.originalname.split('.')
    // 自定义图片名称
    const extension = fileFormat[fileFormat.length - 1]; // 图片后缀
    const hash = crypto.createHash('sha256').update(file.originalname).digest('hex'); // 对图片名进行hash转换
    const newFileName = hash + '.' + extension;
    cb(null, newFileName)
  }
})

// 4. 为 multer 添加配置
const multerConfig = multer({
  storage: storage,
  limits: { fileSize: 2097152 } // 2M
})

export default multerConfig
