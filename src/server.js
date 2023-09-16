// import app from './app';
import app from './login/index.js'

import { systemConfig } from './config/index.js';

const server = app.listen(systemConfig.port, function() {
  console.log(`server is listening at port ${systemConfig.port}`);
});

export default server;