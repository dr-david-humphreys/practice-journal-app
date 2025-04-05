import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ThemeProvider from './components/ThemeProvider'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import StudentPracticeLog from './pages/student/PracticeLog'
import StudentHistory from './pages/student/History'
import ParentChildren from './pages/parent/Children'
import ParentSignature from './pages/parent/Signature'
import DirectorStudents from './pages/director/Students'
import DirectorWeeklyReports from './pages/director/WeeklyReports'
import DirectorStatistics from './pages/director/Statistics'
import DirectorSettings from './pages/director/Settings'
import NotFound from './pages/NotFound'
import { UserRole } from './types/user'

function App() {
  const { checkAuth, userRole } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<Layout />}>
          {/* Redirect based on user role */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                {userRole === UserRole.STUDENT ? (
                  <Navigate to="/practice" replace />
                ) : userRole === UserRole.PARENT ? (
                  <Navigate to="/children" replace />
                ) : userRole === UserRole.DIRECTOR ? (
                  <Navigate to="/students" replace />
                ) : (
                  <Dashboard />
                )}
              </ProtectedRoute>
            } 
          />

          {/* Student Routes */}
          <Route 
            path="/practice" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <StudentPracticeLog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <StudentHistory />
              </ProtectedRoute>
            } 
          />

          {/* Parent Routes */}
          <Route 
            path="/children" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.PARENT]}>
                <ParentChildren />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/children/:childId/records/:recordId" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.PARENT]}>
                <ParentSignature />
              </ProtectedRoute>
            } 
          />

          {/* Director Routes */}
          <Route 
            path="/students" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.DIRECTOR]}>
                <DirectorStudents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/weekly-reports" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.DIRECTOR]}>
                <DirectorWeeklyReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/statistics" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.DIRECTOR]}>
                <DirectorStatistics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.DIRECTOR]}>
                <DirectorSettings />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
