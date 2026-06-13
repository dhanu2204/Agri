import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Dashboard from './Dashboard.jsx'
import Market from './Market.jsx'
import VoiceAssistant from './VoiceAssistant.jsx'
import Calculator from './Calculator.jsx'
import Register from './Register.jsx'
import Login from './Login.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <div>
        {/* Render Navbar at the top of all pages */}
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Register/>}/>

          {/* Secure/Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/market" element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          } />
          <Route path="/voiceassistant" element={
            <ProtectedRoute>
              <VoiceAssistant />
            </ProtectedRoute>
          } />
          <Route path="/calculator" element={
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
