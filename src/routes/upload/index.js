import express from 'express'
import { UserController } from '../../controllers/upload.js'

const router = express.Router()

router.post('/upload', UserController)

export default router