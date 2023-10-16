import db from '../../utils/mysql.js';

// 查询商品列表
export const getProductList = (params) => {
  return new Promise(async (resolve, reject) => {
    const { page = 1, size = 10, category } = params;
    const offset = (page - 1) * size;
    let totalCountQuery = `SELECT COUNT(*) as total_rows FROM product_info${category ? ' WHERE category = ?' : ''};`;
    let productListQuery = `SELECT * FROM product_info${category ? ' WHERE category = ?' : ''} LIMIT ? OFFSET ?;`;
    let queryParams = category ? [category, size, offset] : [size, offset];

    try {
      const totalCountResult = await db(totalCountQuery, queryParams);
      const totalCount = totalCountResult[0].total_rows;
      const productListResult = await db(productListQuery, queryParams);
      resolve({
        total_rows: totalCount,
        data: productListResult,
      });
    } catch (error) {
      reject(error);
    }
  });
};