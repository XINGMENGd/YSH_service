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
  const { name, description, price, stock, category, status, images: imageArray, sellerId, created_at } = params
  connection.query(
    `INSERT INTO product_info
  ( NAME, description, price, stock, category, STATUS, imageArray, sellerId, created_at)
    VALUES
  ('${name}', '${description}', ${price}, ${stock}, '${category}', '${status}', '${imageArray}', ${sellerId}, '${created_at}')`,
    (error, results) => {
      if (error) {
        return callback(error);
      }

      callback(null, results);
    }
  );
};

// 修改商品信息
export const updateProduct = (params, callback) => {
  const { id, name, description, price, stock, category, status, images: imageArray, updated_at } = params

  connection.query(
    `UPDATE product_info SET
     price = ${price}, NAME = '${name}', description = '${description}', stock = ${stock}, category = ${category}, 
     updated_at = '${updated_at}', imageArray = '${imageArray}', STATUS = ${status}
     WHERE id = ${id};`,
    (error, results) => {
      if (error) {
        return callback(error);
      }

      callback(null, results);
    }
  );
};
