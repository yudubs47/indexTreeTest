import React from 'react'
import ReactDOM from 'react-dom/client'
import Test from './Test'
import { RootProvide } from './components/useRootState'
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootProvide>
      <Test />
    </RootProvide>
  </React.StrictMode>
)
