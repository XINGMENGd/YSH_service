import multer from "multer";
import fs from "fs";

// 封装处理路径函数
// 1. 打开或创建一个名字叫folder文件夹
let createFolder = function (folder) {
  try {
    fs.accessSync(folder); // 打开文件夹
  } catch (e) {
    fs.mkdirSync(folder); // 创建文件夹
    fs.accessSync(folder); // 打开文件夹
  }
};
let uploadFolder = 'uploads'; // 设定存储文件夹为当前目录下的 /upload 文件夹
createFolder(uploadFolder);

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
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})

// 4. 为 multer 添加配置
const multerConfig = multer({
  storage: storage,
  limits: { fileSize: 2097152 } // 2M
})

export default multerConfig
