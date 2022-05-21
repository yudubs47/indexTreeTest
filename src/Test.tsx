import React, { FC, useState, useRef, useEffect, useCallback } from "react";
import UseIndexTree from './components/useIndexTree'
import useRootState from './components/useRootState'
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
  const [data, fns] = UseIndexTree(defaultData)
  const [parentId, setParentId] = useState('')
  const [addNode, setAddNode] = useState({
    id: '',
    children: []
  })
  const { value, updateValue } = useRootState('root')

  const changeFn = useCallback((e) => {
    setAddNode({
      id: e.target.value,
      children: []
    })
  }, [])

  useEffect(() => {
    console.log('index', fns.getAllIndex())
  }, [data])

  const addFn = useCallback(() => {
    if (addNode?.id && parentId) {
      fns.addNode(parentId, addNode)
    }
  }, [addNode?.id, parentId])

  const removeFn = useCallback(() => {
    if (addNode?.id) {
      fns.removeNodeById(addNode.id)
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

  const plusFn = useCallback(() => updateValue({ type: 'plus' }), [])

  return (
    <div>
      <div className="line">parentId: <input type="text" value={parentId} onChange={(e) => setParentId(e.target.value)} /> </div>
      <div className="line">
        id: <input type="text" value={addNode?.id} onChange={changeFn} /> <button onClick={addFn}>add</button> <button onClick={removeFn}>remove</button>
      </div>
      <div className="view">
        {create(data)}
      </div>
      <p>
        测试useRootState<button onClick={plusFn}>plus{value}</button>
      </p>
    </div>
  )
}

export default Test
