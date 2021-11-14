// eslint-disable-next-line no-use-before-define
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'
import Hi from './pages/hi/[name]'

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/hi">
          <Route path=":name" element={<Hi />}/>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('app'),
)
