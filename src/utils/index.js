export const MapTree = (menuList, parent_id = null) => {
    const idMap = new Map();
    const tree = [];

    for (const node of menuList) {
        const { id, parent_id } = node;
        node.children = [];
        idMap.set(id, node);
    }

    for (const node of idMap.values()) {
        const parent = idMap.get(node.parent_id);

        if (parent) {
            parent.children.push(node);
        } else {
            tree.push(node);
        }
    }

    return tree;

    // const tree = [];
    // for (let i = 0; i < menuList.length; i++) {
    //   if (menuList[i].parent_id === parent_id) {
    //     const children = setDeptList(menuList, menuList[i].id);

    //     if (children.length) {
    //       menuList[i].children = children;
    //     }
    //     tree.push(menuList[i]);
    //   }
    // }
    // return tree;
}
