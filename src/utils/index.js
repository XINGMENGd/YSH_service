import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

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
  const srcPath = join(rootPath, '/', filePath);
  return srcPath;
};

export const emailRegex = (email) => {
  const reg = /^[a-z0-9._%-]+@[a-z0-9.-]*[a-z0-9]{1}\.[a-z]{2,4}$/;
  const isValidEmail = reg.test(email);
  return isValidEmail;
}