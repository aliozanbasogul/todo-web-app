import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './styles/Switch.css'
import './styles/Form.css'
import LoginRegister from './pages/LoginRegister.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import CreateList from './pages/CreateList.jsx'
import Home from './pages/Home.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="colored"
        draggable
        pauseOnHover
      />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/authpage" element={<LoginRegister />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> 
          <Route path="create-new-ist" element={<CreateList />} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
