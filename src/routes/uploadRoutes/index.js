import express from 'express'
import { uploadController, removeImagesController } from '../../controllers/uploadController.js'

const router = express.Router()

router.post('/uploadImage', uploadController) // 上传图片
router.post('/removeImages', removeImagesController) // 删除图片

export default router