import { Routes, Route } from 'react-router-dom'
import Login from '../src/pages/Login'
import Register from '../src/pages/Register'
import Dashboard from '../src/pages/Dashboard'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
  )
}

export default App
