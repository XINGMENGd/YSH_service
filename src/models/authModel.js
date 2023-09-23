import connection from '../config/mysql/index.js'

// 验证用户登录
export const verifyLogin = (params, callback) => {
  const { username, password } = params;

  connection.query(
    `SELECT * FROM users WHERE username = '${username}' AND password = ${password}`,
    (error, results) => {
      if (error) {
        return callback(error);
      }

      callback(null, results[0]);
    }
  );
};

// 验证用户权限返回路由
export const verifyRoles = (roles, callback) => {
  connection.query(
    `SELECT * FROM route_menu WHERE roles LIKE '%${roles}%'`,
    (error, results) => {
      if (error) {
        return callback(error);
      }

      callback(null, results);
    }
  );
};