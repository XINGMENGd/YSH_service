import { isEmpty } from './index.js'
// 定义判断逻辑策略对象
const logicStrategies = {
  required: (value) => !isEmpty(value), // 属性不为空值
  numeric: (value) => typeof value === 'number', // 属性为数据类型
  positiveNumber: (value) => typeof value === 'number' && value > 0, // 匹配数字类型并且大于0
  decimalPlaces: (value, maxPlaces) => {
    const regex = new RegExp(`^-?\\d+(\\.\\d{0,${maxPlaces}})?$`); // 正则匹配小数位数
    return regex.test(value.toString());
  },
  // 添加其他的判断逻辑...
};

// 定义商品对象判断策略对象
export const productObjectStrategies = {
  description: {
    logic: ['required'],
    message: '商品描述信息不能为空'
  },
  price: {
    logic: ['required', 'positiveNumber', ['decimalPlaces', 2]],
    message: '商品价格必须为正数，最大小数位为两位'
  },
  stock: {
    logic: ['required', 'positiveNumber', ['decimalPlaces', 0]],
    message: '商品库存必须为正整数'
  },
  category: {
    logic: ['required'],
    message: '商品分类不能为空'
  },
  status: {
    logic: ['required'],
    message: '商品状态不能为空'
  },
  seller_id: {
    logic: ['required'],
    message: '创建商品人信息不全'
  },
  created_at: {
    logic: ['required'],
    message: '当前商品创建时间不全'
  },
  imageFiles: {
    logic: ['required'],
    message: '商品展示图不能为空'
  },
};

// 判断函数
export function validateObject(object, strategies) {
  for (const key in strategies) {
    const strategy = strategies[key];
    const { logic, message } = strategy;
    const value = object[key];

    for (const item of logic) {
      let check = item;
      let args = [];

      if (Array.isArray(item)) {
        check = item[0];
        args = item.slice(1);
      }

      const validationFunction = logicStrategies[check];
      if (!validationFunction(value, ...args)) {
        return message;
      }
    }
  }

  return null;
}