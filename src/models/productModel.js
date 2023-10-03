import connection from '../config/mysql/index.js'

// 查询商品列表
export const getProductList = (params, callback) => {
  const page = parseInt(params.page) || 1; // 默认为第一页
  const size = parseInt(params.size) || 10; // 默认每页显示 10 条记录
  const offset = (page - 1) * size; // 计算 offset
  const sort = params.sort
  const direction = params.direction
  const sql = `
    SELECT *,
      ( SELECT COUNT(*) FROM ( SELECT * FROM product_info ) AS sub_query ) AS total_rows 
    FROM
      ( SELECT * FROM product_info ${sort && direction ? `ORDER BY ${sort} ${direction}` : ''}  LIMIT  ${offset}, ${size} ) AS main_query
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

// 查询商品分类列表
export const getProductCategoryList = (params, callback) => {
  const sql = `SELECT * FROM product_category_list`;

  connection.query(sql, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

// 查询商品状态列表
export const getProductStatusList = (params, callback) => {
  const sql = `SELECT * FROM product_status_list`;

  connection.query(sql, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

// 添加商品
export const createProduct = (params, callback) => {
  const { description, price, stock, category, status, images: imageArray, seller_id, created_at } = params
  const sql = `
    INSERT INTO product_info
      (description, price, stock, category, STATUS, imageArray, seller_id, created_at)
    VALUES
      ('${description}', ${price}, ${stock}, '${category}', '${status}', '${imageArray}', ${seller_id}, '${created_at}')
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

// 修改商品信息
export const updateProduct = (params, callback) => {
  const { id, description, price, stock, category, status, images: imageArray, updated_at } = params
  const sql = `
    UPDATE product_info SET
      price = ${price}, description = '${description}', stock = ${stock}, category = ${category}, 
      updated_at = '${updated_at}', imageArray = '${imageArray}', STATUS = ${status}
    WHERE id = ${id};
  `

  connection.query(sql, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};
