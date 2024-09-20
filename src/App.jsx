import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './styles/Switch.css'
import './styles/Form.css'
import LoginRegister from './components/LoginRegister.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import Home from './components/Home.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/authpage" element={<LoginRegister />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> 
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
