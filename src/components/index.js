import React from 'react'
import ChatRoom from './chatRoom'
import {Route, BrowserRouter} from 'react-router-dom'
import './index.css'

export default () => {
  return (
    <BrowserRouter>
      <Route path="/" component={ChatRoom}/>
    </BrowserRouter>
  )
}
