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

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/equipment/:id" element={<Equipment />} />
            <Route path="/equipment-categories" element={<EquipmentCategories />} />
            <Route path="/work-centers" element={<WorkCenters />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/request/new" element={<MaintenanceRequestForm />} />
            <Route path="/request/:id" element={<MaintenanceRequestForm />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  )
}

export default App

