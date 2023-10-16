// 数据库连接配置信息
const mysqlConfig = {
  host: 'localhost',              // 连接数据库服务器地址
  port: 3306,                     // 端口号
  user: 'root',                   // 连接数据库服务器需要的用户名
  password: '$MaN2031/',          // 连接数据库服务器需要的密码
  database: 'vue3_back',          // 所要连接的数据库名字
  // connectionLimit: 10,         //"指定连接池中最大的链接数，默认是10",
  // queueLimit: 0,               //"指定允许挂起的最大连接数，如果挂起的连接数超过该数值，就会立刻抛出错误，默认属性值为0，代表不允许被挂起的最大连接数",
  // multipleStatements: false    //"是否运行执行多条sql语句，默认值为false"
}

export default mysqlConfig
