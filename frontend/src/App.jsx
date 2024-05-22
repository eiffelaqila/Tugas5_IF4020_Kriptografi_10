import './App.css'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import { useAuthContext } from './context/AuthContext'
import { useSocketContext } from './context/SocketContext'

function App() {
  const { authUser } = useAuthContext()
  const { sharedSecret } = useSocketContext()
  return (
    <div className='flex items-center justify-center h-screen p-4'>
      <Routes>
        <Route path='/' element={(authUser && sharedSecret)? <Home />: <Navigate to='/login' />} />
        <Route path='/login' element={(authUser && sharedSecret) ? <Navigate to='/' /> : <Login />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
