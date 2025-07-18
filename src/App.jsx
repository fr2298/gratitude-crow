import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'
import { initializeUsers, isAuthenticated, isAdmin } from './utils/auth'

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  return isAuthenticated() && isAdmin() ? children : <Navigate to="/login" />
}

function App() {
  useEffect(() => {
    // 초기 사용자 데이터 설정 (관리자 계정 포함)
    initializeUsers()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App