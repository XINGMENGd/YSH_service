import express from 'express'
import { UserController } from '../../controllers/uploadController.js'

const router = express.Router()

router.post('/upload', UserController)

export default router