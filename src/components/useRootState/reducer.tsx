import React, { useReducer } from "react";

type Value = { [key: string]: any }
export type OriginAction = { type: string; data?: any }
export type Action = { nameSpace: string; } & OriginAction

export const initialValue: Value = {
  root: 0
}
type Reducers = {
  [key: string]: (pre: any, action: OriginAction) => any
}
const reducers: Reducers = {
  root: (pre: number, action: OriginAction) => {
    switch (action.type) {
      case 'plus':
        return pre + 1
      default:
        return pre
    }
  }
}

const reducer = (value: Value, action: Action) => {
  const nextValue = { ...value }
  const {nameSpace} = action
  const fn = reducers[nameSpace]
  if (fn) {
    nextValue[nameSpace] = fn(value[nameSpace], action)
    return nextValue
  }
  return value
}

// const useValue = () => {
//   const [value, updateValue] = useReducer(reducer, initialValue)
//   return [value, updateValue]
// }

export default reducer