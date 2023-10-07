import connection from '../../utils/mysql.js'

// 查询商品列表
export const getProductList = (params) => {
  return new Promise((resolve, reject) => {
    const { page = 1, size = 10, offset = (page - 1) * size, sort, direction } = params
    const sql = `
      SELECT *,
        ( SELECT COUNT(*) FROM ( SELECT * FROM product_info ) AS sub_query ) AS total_rows 
      FROM
        ( SELECT * FROM product_info ${sort && direction ? `ORDER BY ${sort} ${direction}` : ''}  LIMIT  ${offset}, ${size} ) AS main_query
    `;

    connection.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  })
};

// 查询商品分类列表
export const getProductCategoryList = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM product_category_list`;

    connection.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  })
};

// 查询商品状态列表
export const getProductStatusList = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM product_status_list`;

    connection.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  })
};

// 添加商品
export const createProduct = (params) => {
  return new Promise((resolve, reject) => {
    const { description, price, stock, category, status, images: imageArray, seller_id, created_at } = params
    const sql = `
    INSERT INTO product_info
      (description, price, stock, category, STATUS, imageArray, seller_id, created_at)
    VALUES
      ('${description}', ${price}, ${stock}, '${category}', '${status}', '${imageArray}', ${seller_id}, '${created_at}')
  `;

    connection.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  })
};

// 修改商品信息
export const updateProduct = (params) => {
  return new Promise((resolve, reject) => {
    const { id, description, price, stock, category, status, images: imageArray, updated_at } = params
    const sql = `
      UPDATE product_info SET
        price = ${price}, description = '${description}', stock = ${stock}, category = ${category}, 
        updated_at = '${updated_at}', imageArray = '${imageArray}', STATUS = ${status}
      WHERE id = ${id};
    `

    connection.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  })
};
