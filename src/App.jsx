import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './styles/Switch.css'
import './styles/Form.css'
import LoginRegister from './components/LoginRegister.jsx'
import Home from './components/Home.jsx'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
