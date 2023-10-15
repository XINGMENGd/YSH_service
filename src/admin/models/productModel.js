import db from '../../utils/mysql.js';

// 查询商品列表
export const getProductList = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { page = 1, size = 10, sort, direction } = params;
      const offset = (page - 1) * size;
      let sql = `
        SELECT *,
          (SELECT COUNT(*) FROM product_info) AS total_rows 
        FROM product_info
      `;
      if (sort && direction) { sql += `ORDER BY ${sort} ${direction} `; }
      sql += `LIMIT ${offset}, ${size}`;

      const data = await db(sql);
      resolve(data)
    } catch (error) {
      reject(error)
    }
  });
};

// 查询商品分类列表
export const getProductCategoryList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM product_category_list`;

      const data = await db(sql)
      resolve(data)
    } catch (error) {
      reject(error);
    }
  })
};

// 查询商品状态列表
export const getProductStatusList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM product_status_list`;
      const data = await db(sql)
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
};

// 添加商品
export const createProduct = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { description, price, stock, category, status, seller_id, created_at, imageFiles, videoFiles } = params
      const values = [description, price, stock, category, status, seller_id, created_at, imageFiles, videoFiles]
      const sql = `
        INSERT INTO product_info
          (description, price, stock, category, STATUS, seller_id, created_at, imageFiles, videoFiles)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const data = await db(sql, values)
      resolve(data);
    } catch (error) {
      reject(error);
    }
  })
};

// 修改商品信息
export const updateProduct = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, description, price, stock, category, status, updated_at, imageFiles, videoFiles } = params;
      const values = [price, description, stock, category, status, updated_at, imageFiles, videoFiles, id];
      const sql = `
        UPDATE product_info SET
          price = ?,
          description = ?,
          stock = ?,
          category = ?,
          STATUS = ?,
          updated_at = ?,
          imageFiles = ?,
          videoFiles = ?
        WHERE id = ?
      `;

      const data = await db(sql, values)
      resolve(data);
    } catch (error) {
      reject(error)
    }
  });
};
