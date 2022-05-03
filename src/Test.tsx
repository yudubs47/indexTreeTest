import React, { FC, useState, useRef, useEffect, useCallback } from "react";
import IndexTree from "./components/indexTree"; // 补个use版本
import './test.css'

const defaultData = {
  id: '0',
  children: [
    {
      id: '00',
      children: [
        {
          id: '000',
          children: [
            {
              id: '0000',
              children: []
            },
          ] 
        },
        {
          id: '001',
          children: [
            {
              id: '0010',
              children: []
            },
          ] 
        }
      ]
    },
    { id: '01', children: [] },
    {
      id: '02',
      children: [
        {
          id: '020',
          children: []
        },
        {
          id: '021',
          children: [
            {
              id: '0210',
              children: []
            },
          ]
        },
      ] 
    }
  ]
}

type Props = {}

const Test: FC<Props> = () => {
  const treeRef = useRef(new IndexTree(defaultData))
  const [data, setData] = useState(treeRef.current.getTreeData())
  const [parentId, setParentId] = useState('')
  const [addNode, setAddNode] = useState({
    id: '',
    children: []
  })

  const changeFn = useCallback((e) => {
    setAddNode({
      id: e.target.value,
      children: []
    })
  }, [])

  useEffect(() => {
    console.log('index', treeRef.current.getAllIndex())
  }, [data])

  const addFn = useCallback(() => {
    if (addNode?.id && parentId) {
      treeRef.current.addNode(parentId, addNode)
      setData(treeRef.current.getTreeData())
    }
  }, [addNode?.id, parentId])

  const removeFn = useCallback(() => {
    if (addNode?.id) {
      treeRef.current.removeNodeById(addNode.id)
      setData(treeRef.current.getTreeData())
    }
  }, [addNode?.id])

  const create = (data) => {
    return (
      <div className="treeLine" key={data.id}>
        <div className="text">{data.id}</div>
        <div className="bottomLine"></div>
        {data.children.map(v => create(v))}
      </div>
    )
  }

  return (
    <div>
      <div className="line">parentId: <input type="text" value={parentId} onChange={(e) => setParentId(e.target.value)} /> </div>
      <div className="line">
        id: <input type="text" value={addNode?.id} onChange={changeFn} /> <button onClick={addFn}>add</button> <button onClick={removeFn}>remove</button>
      </div>
      <div className="view">
        {create(data)}
      </div>
    </div>
  )
}

export default Test
