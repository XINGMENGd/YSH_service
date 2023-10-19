### 项目目录结构

- / logs                （日志打印文件）

- / public              （公共静态资源）
  - /css
  - /images
  - /js

- / uploads             （用户上传文件目录）
    - images            （图片存储目录）
    - temp              （临时存储目录）
    - videos            （视频存储目录）

- /src
  - /admin               （后台项目接口）
    - /controllers          （控制器文件） C - 负责逻辑
    - /models               （模型文件）   M - 负责数据
    - /routes               （路由文件）
    - /views                （视图文件）   V - 负责视图

  - /common              （公共接口）
    - /controllers          （控制器文件） C - 负责逻辑
    - /models               （模型文件）   M - 负责数据
    - /routes               （路由文件）
    - /views                （视图文件）   V - 负责视图  
  
  - /config              （配置文件目录）
    - /development            （开发环境配置文件）
      - config.json           （开发环境配置文件）
    - /production             （生产环境配置文件）
      - config.json           （生产环境配置文件）
    - .env                    （环境变量配置文件）

  - /frontend            （前台项目接口）
    - /controllers          （控制器文件） C - 负责逻辑
    - /models               （模型文件）   M - 负责数据
    - /routes               （路由文件）
    - /views                （视图文件）   V - 负责视图

  - /middleware          （中间件文件）
    - tokenAuth.js

  - /utils               （辅助工具文件夹）
    - multerConfig.js           （上传文件的配置文件）

  - server.js            （应用主文件）

- package.json           （项目配置文件）