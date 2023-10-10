import express from 'express';
import { systemConfig } from './config/index.js';
import { configureApp } from './middleware/index.js';

const app = express()

configureApp(app)

app.listen(systemConfig.port, () => {
  console.log(`Server started on port ${systemConfig.port}`);
});