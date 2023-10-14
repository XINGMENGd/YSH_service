import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// 递归处理路由，将之处理成树状结构返回
export const MapTree = (menuList) => {
  const tree = [];
  const idMap = new Map();

  for (const node of menuList) {
    const { id, parent_id, roles, name, path, component, ...meta } = node;
    const children = [];
    const newNode = { name, path, meta, children };
    if (component) {
      newNode.component = component;
    }
    if (menuList.some(item => item.parent_id === id)) {
      newNode.children = children;
    } else {
      // 删除 children 属性
      delete newNode.children;
    }
    idMap.set(id, newNode);
  }

  for (const [id, node] of idMap) {
    const parent = idMap.get(menuList.find(item => item.id === id)?.parent_id);
    if (parent) {
      parent.children.push(node);
    } else {
      tree.push(node);
    }
  }

  return tree;

  //   // const tree = [];
  //   // for (let i = 0; i < menuList.length; i++) {
  //   //   if (menuList[i].parent_id === parent_id) {
  //   //     const children = setDeptList(menuList, menuList[i].id);

  //   //     if (children.length) {
  //   //       menuList[i].children = children;
  //   //     }
  //   //     tree.push(menuList[i]);
  //   //   }
  //   // }
  //   // return tree;
}
// 匹配根路径
export const relativePath = (filePath) => {
  const rootPath = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
  const srcPath = join(rootPath, filePath);
  return srcPath;
};
// 验证邮箱号码格式
export const emailRegex = (email) => {
  const reg = /^[a-z0-9._%-]+@[a-z0-9.-]*[a-z0-9]{1}\.[a-z]{2,4}$/;
  const isValidEmail = reg.test(email);
  return isValidEmail;
}
// 判断属性不为空值（包括数组级对象）
export const isEmpty = (value) => {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object' && value !== null) {
    for (let key in value) {
      if (!isEmpty(value[key])) {
        return false;
      }
    }
    return true;
  }
  return value === undefined || value === null || value === '';
};
// 验证手机号格式
export const phoneNumberRegex = (phoneNumber) => {
  const reg = /^[1-9]\d{9}$/;
  const isValidPhoneNumber = reg.test(phoneNumber);
  return isValidPhoneNumber;
}