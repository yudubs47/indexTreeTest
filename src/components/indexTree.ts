type NodeId = string | number; // 必须确保树内唯一

type DefaultData = {
  id: NodeId;
  children: DefaultData[];
  [key: string]: any;
}

type Options = {
  idKey: string; // 指定唯一标识字段，支持形如 node.id，需要与T一至
  childrenKey: string; // 指定子元素数组字段，需要与T一至
}

class IndexTree<T = DefaultData> {
  private index: { [key: string]: string };
  private idKey: string;
  private childrenKey: string;
  public treeData: T;
  constructor(data: T, options?: Options) {
    this.treeData = data;
    this.index = {}; // 索引
    this.idKey = options?.idKey || 'id';
    this.childrenKey = options?.childrenKey || 'children';
    this.buildIndex(data);
  }

  

  // 重新初始化
  initial(data: T) {
    this.treeData = data;
    this.buildIndex(data);
  }

  getAllIndex() {
    return { ...this.index };
  }

  // 追加模式
  addNode(parentId: NodeId, node: T) {
    const parentNode = this.getNodeById(parentId);
    if (parentNode) {
      const children = this.getChildren(parentNode);
      children.push(node);
      this.index[this.getNodeId(node)] = `${this.index[parentId]}-${children.length - 1}`
      this.rebuildNodeById(parentId)
    }
    return this;
  }

  removeNodeById(id: NodeId) {
    const curPath = this.index[id];
    if (curPath) {
      const pathArr = this.parsePath(curPath);
      const parentNode = this.getParentNodeById(id);
      if (parentNode) {
        const parentId = this.getNodeId(parentNode);
        const curIndex = pathArr[pathArr.length - 1];
        this.getChildren(parentNode).splice(curIndex, 1);
        this.deleteIndexById(parentId);
        this.buildIndex(parentNode, pathArr.slice(0, -1));
        this.rebuildNodeById(parentId);
      }
    }
    return this;
  }

  getNodeById(id: NodeId) {
    const levelPath = this.index[id];
    if (levelPath) {
      return this.getNodeByLevelPath(levelPath);
    }
  }

  getParentNodeById(id: NodeId) {
    const levelPath = this.index[id];
    if (!levelPath) {
      return;
    }
    const levelPathArr = this.parsePath(levelPath);
    if (levelPathArr.length < 2) {
      return;
    }
    return this.getNodeByLevelArr(levelPathArr.slice(0, levelPathArr.length - 1));
  }

  // todo move fn
  
  insertNode(id: NodeId, node: T, postion: 'after' | 'before' = 'after') {
    const tarIndex = this.index[id]
    const parentNode = this.getParentNodeById(id)
    if (tarIndex && parentNode) {
      const nodeIndex = this.getLastNumIndex(tarIndex)
      const postionIndex = postion === 'before' ? nodeIndex : nodeIndex + 1
      this.getChildren(parentNode).splice(postionIndex, 0, node)
      const parentId = this.getNodeId(parentNode)
      this.deleteIndexById(parentId)
      this.buildIndex(parentNode, this.parsePath(this.index[parentId]));
      this.rebuildNodeById(parentId);
    }
    return this;
  }

  getTreeData() {
    return this.treeData;
  }

  private buildIndex(data: T, initalLevel: number[] = [0]) {
    const levels = [...initalLevel]; // 标识当前访问层级 && node index
    let curNode: T | undefined = data;
    while (levels.length >= initalLevel.length) {
      if (curNode) {
        this.index[this.getNodeId(curNode)] = levels.join('-');
        const childNodes = this.getChildren(curNode);
        if (childNodes.length) {
          levels.push(0);
          curNode = childNodes[0];
        } else {
          levels[levels.length - 1] += 1;
          curNode = this.getNodeByLevelArr(levels);
        }
      } else { // 访问越界
        levels.pop();
        if (levels.length > initalLevel.length) {
          levels[levels.length - 1] += 1;
          curNode = this.getNodeByLevelArr(levels);
        }
      }
    }
  }

  private deleteIndexByPath(path: string) {
    Object.keys(this.index).forEach((key) => {
      if (this.index[key].indexOf(path) !== -1) {
        delete this.index[key];
      }
    })
  }

  private deleteIndexById(id: NodeId) {
    const path = this.index[id];
    if (path) {
      this.deleteIndexByPath(path);
    }
  }

  // 从id指定节点重建到根节点(包含)
  private rebuildNodeById(id: NodeId) {
    const pathArr = this.parsePath(this.index[id]);
    this.treeData = { ...this.treeData };
    this.treeData[this.childrenKey] = [...this.getChildren(this.treeData)];
    let parentNode = this.treeData;
    for (let i = 1; i < pathArr.length; i++) {
      const pathIndex = pathArr[i];
      const childNodes = this.getChildren(parentNode);
      const curNode = childNodes[pathIndex];
      childNodes[pathIndex] = {
        ...curNode,
        [this.childrenKey]: [...curNode[this.childrenKey]]
      };
    }
  }

  private getNodeId(node: T) {
    if (!node) {
      return ;
    }
    const keys = this.idKey.split('.');
    let val = node[keys[0]];
    for (let i = 1; i < keys.length; i++) {
      val = val[keys[i]];
      if (val === undefined) {
        return ;
      }
    }
    return val;
  }

  private getChildren(node: T) {
    return node[this.childrenKey];
  }

  private getNodeByLevelPath(str: string, data: T = this.treeData) {
    const numArr = this.parsePath(str);
    return this.getNodeByLevelArr(numArr, data);
  }

  private getNodeByLevelArr(arr: number[], data: T = this.treeData) {
    let node = data
    for (let i = 1; i < arr.length; i++) {
      node = this.getChildren(node)[arr[i]];
      if (!node) {
        return;
      }
    }
    return node;
  }

  private parsePath(str: string) {
    return str.split('-').map(v => +v)
  }

  private getLastNumIndex(str: string) {
    const arr = this.parsePath(str)
    return arr[arr.length - 1]
  }
}

export default IndexTree;
