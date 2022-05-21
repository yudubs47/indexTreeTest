import React, { useState, useRef, useMemo, useCallback } from "react";
import IndexTree from "./indexTree";

type Options = {
  idKey: string;
  childrenKey: string;
}

type NodeId = string | number; // 必须确保树内唯一

type DefaultData = {
  id: NodeId;
  children: DefaultData[];
  [key: string]: any;
}
// 类型推断有问题，要手写。。。。
type Fns<T> = {
  initial: (data: T) => void,
  getAllIndex: () => { [key: NodeId]: string },
  addNode: (parentId: NodeId, node: T) => void,
  removeNodeById: (id: NodeId) => void,
  getNodeById: (id: NodeId) => void,
  getParentNodeById: (id: NodeId) => void,
  insertNode: (parentId: NodeId, node: T, postion: 'after' | 'before') => void,
  getTreeData: () => T,
}
// 凑合着用
function UseIndexTree<T = DefaultData>(data: T, options?: Options): [T, Fns<T>] {
  const treeRef = useRef(new IndexTree<T>(data, options))
  const [treeData, setTreeData] = useState(treeRef.current.getTreeData())
  const resetTreeData = useCallback(() => setTreeData(treeRef.current.getTreeData()), [])
  // 简短 啰嗦 有效
  const fns = useMemo(() => ({
    initial: (data: T) => {
      treeRef.current.initial(data)
      resetTreeData()
    },
    getAllIndex: () => treeRef.current.getAllIndex(),
    addNode: (parentId: NodeId, node: T) => {
      treeRef.current.addNode(parentId, node)
      resetTreeData()
    },
    removeNodeById: (id: NodeId) => {
      treeRef.current.removeNodeById(id)
      resetTreeData()
    },
    getNodeById: (id: NodeId) => treeRef.current.getNodeById(id),
    getParentNodeById: (id: NodeId) => treeRef.current.getParentNodeById(id),
    insertNode: (parentId: NodeId, node: T, postion: 'after' | 'before' = 'after') => {
      treeRef.current.insertNode(parentId, node, postion)
      resetTreeData()
    },
    getTreeData: () => treeRef.current.getTreeData(),
  }), [])
  return [treeData, fns]
}

export default UseIndexTree
