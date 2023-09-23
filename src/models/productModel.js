import connection from '../config/mysql/index.js'

// 查询商品列表
export const fetchProduct = (params, callback) => {
  const page = parseInt(params.page) || 1; // 默认为第一页
  const pageSize = parseInt(params.pageSize) || 10; // 默认每页显示 10 条记录
  const offset = (page - 1) * pageSize; // 计算 offset

  connection.query(
    `SELECT * FROM product_info LIMIT ${pageSize} OFFSET ${offset}`,
    (error, results) => {
      if (error) {
        return callback(error);
      }

      callback(null, results);
    }
  );
};

// 添加商品
export const createProduct = (params, callback) => {
  const { name, description, price, stock, category, status, image, sellerId, created_at } = params

  connection.query(
    `INSERT INTO product_info
    ( NAME , description , price , stock , category , STATUS , image , sellerId , created_at )
      VALUES
    ( '${name}','${description}',${price},${stock},'${category}','${status}','${image}',${sellerId},'${created_at}' )`,
    (error, results) => {
      if (error) {
        return callback(error);
      }

      callback(null, results);
    }
  );
};
