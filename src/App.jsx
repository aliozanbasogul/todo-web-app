import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './styles/Switch.css'
import './styles/Form.css'
import LoginRegister from './components/LoginRegister.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LoginRegister />
    </>
  )
}

export default App
