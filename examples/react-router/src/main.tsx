import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import About from './pages/About'
import Hi from './pages/hi/[name]'
import Home from './pages/Home'
import './index.css'

createRoot(document.getElementById('app')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/hi">
          <Route path=":name" element={<Hi />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
)
