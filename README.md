**项目目录结构
- /public                      （公共静态资源）
  - /css
  - /images
  - /js

- /uploads                     （用户上传的图片文件夹）
    - image1.jpg
    - image2.jpg

- /src
  - /config                    （配置文件目录）
    - /development             （开发环境配置文件）
      - config.json            （开发环境配置文件）
    - /production              （生产环境配置文件）
      - config.json            （生产环境配置文件）
    - .env                     （环境变量配置文件）

  - /controllers               （控制器文件）C - 负责逻辑
    - userController.js
    - postController.js

  - /middleware                （中间件文件）
    - tokenAuth.js

  - /models                    （模型文件）M - 负责数据
    - user.js
    - post.js

  - /routes                    （路由文件）
    - index.js
    - userRoutes.js
    - postRoutes.js

  - /utils                     （实用工具文件夹）
    - multerConfig.js           （上传文件的配置文件）
  
  - /views                     （视图文件） V
    - home.ejs
    - login.ejs

  - server.js                  （应用主文件）

- package.json                 （项目配置文件）