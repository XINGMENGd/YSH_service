import fs from 'fs';
import multer from "multer";
import { BaseURL, imagePath, responseConfig, tempPath, videoPath } from '../../config/index.js';
import { relativePath } from '../../utils/index.js';
import _ from 'lodash';

const multerConfig = multer({ dest: tempPath, limits: 1024 * 1024 * 5 })

// 深拷贝response对象，确保每个接口使用的是独立的response对象
const response = _.cloneDeep(responseConfig);
// 上传图片的逻辑控制器
export const uploadFileController = {
  method: 'post',
  handler: async (req, res) => {
    multerConfig.single('file')(req, res, function (err) {
      if (err) {
        res.json(err)
      } else {
        const { name, fileType } = req.body
        let filePath = ''
        if (fileType.includes('image')) {
          filePath = imagePath
        } else if (fileType.includes('video')) {
          filePath = videoPath
        }
        fs.mkdirSync(filePath, { recursive: true }); // recursive 使用递归创建目录，如果父目录不存在会先创建
        fs.renameSync(req.file.path, filePath + name)
        response.message = '上传成功'; response.data = { img_url: BaseURL + filePath + name }
        res.json(response)
      }
    })
  }
}

// 删除文件的逻辑控制器
export const removeFilesController = {
  method: 'post',
  handler: async (req, res) => {
    const { deleteFiles } = req.body
    try {
      await deleteFiles.forEach(item => {
        if (item.fileType.includes('image')) {
          fs.unlinkSync(relativePath(imagePath) + item.fileName)
        } else if (item.fileType.includes('video')) {
          fs.unlinkSync(relativePath(videoPath) + item.fileName)
        }
      })
      response.message = '删除成功'
      res.json(response)
    } catch (err) {
      response.message = '文件不存在'
      res.json(response)
    }
  }
}

// 上传分片的逻辑控制器
export const uploadChunksController = {
  method: 'post',
  handler: (req, res) => {
    multerConfig.single('file')(req, res, async function (err) {
      const { fileType, index, hash } = req.body;
      let chunksPath = ''
      if (fileType.includes('image')) {
        chunksPath = relativePath(imagePath + hash + '/')
      } else if (fileType.includes('video')) {
        chunksPath = relativePath(videoPath + hash + '/')
      }
      fs.mkdirSync(chunksPath, { recursive: true }); // recursive 使用递归创建目录，如果父目录不存在会先创建
      fs.renameSync(req.file.path, chunksPath + hash + '-' + index)
      response.message = '分片上传成功'
      res.json(response)
    })
  }
}

// 合并分片的逻辑控制器
export const mergeChunksController = {
  method: 'post',
  handler: (req, res) => {
    const { fileType, hash, name, total } = req.body;
    let chunksPath = ''
    let filePath = ''
    if (fileType.includes('image')) {
      chunksPath = relativePath(imagePath + hash + '/')
      filePath = imagePath
    } else if (fileType.includes('video')) {
      chunksPath = relativePath(videoPath + hash + '/')
      filePath = videoPath
    }
    const chunks = fs.readdirSync(chunksPath)
    if (chunks.length !== total || chunks.length === 0) {
      response.message = '上传文件分片异常'
      return res.json(response)
    }
    fs.writeFileSync(filePath + name, '')
    for (let i = 0; i < total; i++) {
      fs.appendFileSync(filePath + name, fs.readFileSync(chunksPath + hash + '-' + i))
      fs.unlinkSync(chunksPath + hash + '-' + i)
    }
    fs.rmdirSync(chunksPath)
    response.message = '文件上传成功'; response.data = { img_url: BaseURL + filePath + name }
    res.json(response)
  }
}