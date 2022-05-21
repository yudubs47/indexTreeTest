import React, { FC, useReducer, useMemo, useContext, ReactNode } from "react";
import reducer, { initialValue, Action, OriginAction } from './reducer'

type DefaultContextvValue = {
  value: { [key: string]: any }
  updateValue: React.Dispatch<Action>
}
const defaultContextvValue: DefaultContextvValue = { value: {}, updateValue: () => {} }
export const RootContext = React.createContext(defaultContextvValue)

type Props = { children: ReactNode }
export const RootProvide: FC<Props> = (props) => {
  const [value, updateValue] = useReducer(reducer, initialValue)
  const { children } = props
  const rootValue = useMemo(() => ({ value, updateValue }), [value])
  return (
    <RootContext.Provider value={rootValue}>
      {children}
    </RootContext.Provider>
  )
}

const useRootState = (nameSpace: string) => {
  const { value, updateValue } = useContext(RootContext)
  return {
    value: value[nameSpace],
    updateValue: (action: OriginAction) => updateValue({ ...action, nameSpace })
  }
}

export default useRootState