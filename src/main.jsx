import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/login'
import Register from './pages/Register'
import AuthCallback from './pages/AuthCallback'
import AdminDashboard from './pages/admin/Dashboard'
import TrainerPortal from './pages/trainer/portal'
import MemberView from './pages/member/view'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/trainer" element={<TrainerPortal />} />
          <Route path="/member" element={<MemberView />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)