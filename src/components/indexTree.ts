type id = string | number;
type defaultData = {
  id: id;
  children: defaultData[];
  [key: string]: any;
}
type options = {
  idKey: string; // 指定唯一标识字段，支持形如 node.id，需要与T一至
  childrenKey: string; // 指定子元素数组字段，需要与T一至
}

class IndexTree<T = defaultData> {
  private treeIndex: { [key: string]: string };
  private idKey: string;
  private childrenKey: string;
  public tree: T;
  constructor(data: T, options?: options) {
    this.tree = data;
    this.treeIndex = {}; // 索引
    this.idKey = options?.idKey || 'id';
    this.childrenKey = options?.childrenKey || 'children';
    this.buildIndex(data)
  }

  private buildIndex(data: T, initalLevel: number[] = [0]) {
    // const lastInitalLevel = this.getLastArrNode(initalLevel)
    const levels = [...initalLevel]; // 标识当前访问层级&&node index
    let curNode: T | undefined = data;
    let i = 0
    while (levels.length >= initalLevel.length && i < 100) {
      console.log('levels', levels)
      i++ 
      if (curNode) {
        this.treeIndex[this.getNodeId(curNode)] = levels.join('-');
        const childNodes = this.getNodeChildren(curNode);
        if (childNodes.length) {
          levels.push(0);
          curNode = childNodes[0];
        } else {
          levels[levels.length - 1] += 1;
          curNode = this.getNodeByLevelArr(levels)
        }
      } else { // 访问越界
        levels.pop();
        if (levels.length > initalLevel.length) {
          levels[levels.length - 1] += 1;
          curNode = this.getNodeByLevelArr(levels)
        }
      }
    }
    console.log(i)
  }

  initialFullTree(data: T) {
    this.tree = data
  }

  getTreeIndex() {
    return { ...this.treeIndex };
  }

  private getNodeId(node: T) {
    if (!node) {
      return undefined
    }
    const keys = this.idKey.split('.');
    let val = node[keys[0]];
    for (let i = 1; i < keys.length; i++) {
      val = val[keys[i]];
      if (val === undefined) {
        return undefined
      }
    }
    return val
  }

  private getNodeChildren(node: T) {
    return node[this.childrenKey];
  }

  private getNodeByLevelPath(str: string, data: T = this.tree) {
    const numArr = str.split('-').map(v => +v);
    return this.getNodeByLevelArr(numArr, data);
  }

  private getNodeByLevelArr(arr: number[], data: T = this.tree) {
    let node = data
    for (let i = 1; i < arr.length; i++) {
      node = this.getNodeChildren(node)[arr[i]];
      if (!node) {
        return undefined
      }
    }
    return node
  }

  private getLastArrNode<W>(arr: W[]) {
    const len = arr.length;
    if (len) {
      return arr[len - 1];
    }
    return undefined;
  }
}

export default IndexTree;
