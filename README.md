**indexTree**

目标形如{ id: 'abc', children: [] }结构的树，内置索引
- 0502 带索引的树，保持不可变，待测试 src/components/indexTree.ts
- 0504 增加 src/components/useIndexTree.tsx
- 0521 换个目录~ src\components\useIndexTree
- 
**useRootState**

单一react context，namespace仅用于区分，对rootState的更新会导致所有消费rootState的组件重现渲染(多个contex + Provider没有这问题)
- 0521 增加 src\components\useRootState
