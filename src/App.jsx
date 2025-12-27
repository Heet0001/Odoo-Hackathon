import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Equipment from './pages/Equipment'
import EquipmentCategories from './pages/EquipmentCategories'
import WorkCenters from './pages/WorkCenters'
import Teams from './pages/Teams'
import KanbanBoard from './pages/KanbanBoard'
import MaintenanceRequestForm from './pages/MaintenanceRequestForm'
import CalendarView from './pages/CalendarView'
import Reports from './pages/Reports'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/equipment" element={<ProtectedRoute><Layout><Equipment /></Layout></ProtectedRoute>} />
          <Route path="/equipment/:id" element={<ProtectedRoute><Layout><Equipment /></Layout></ProtectedRoute>} />
          <Route path="/equipment-categories" element={<ProtectedRoute><Layout><EquipmentCategories /></Layout></ProtectedRoute>} />
          <Route path="/work-centers" element={<ProtectedRoute><Layout><WorkCenters /></Layout></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute><Layout><Teams /></Layout></ProtectedRoute>} />
          <Route path="/kanban" element={<ProtectedRoute><Layout><KanbanBoard /></Layout></ProtectedRoute>} />
          <Route path="/request/new" element={<ProtectedRoute><Layout><MaintenanceRequestForm /></Layout></ProtectedRoute>} />
          <Route path="/request/:id" element={<ProtectedRoute><Layout><MaintenanceRequestForm /></Layout></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Layout><CalendarView /></Layout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App

