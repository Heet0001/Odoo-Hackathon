import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useApp } from '../context/AppContext'

const Reports = () => {
  const { requests, equipment, teams } = useApp()

  // Requests per Team
  const requestsPerTeam = useMemo(() => {
    const teamCounts = {}
    requests.forEach(request => {
      const team = request.assignedTeam || 'Unassigned'
      teamCounts[team] = (teamCounts[team] || 0) + 1
    })
    return Object.entries(teamCounts).map(([name, count]) => ({ name, count }))
  }, [requests])

  // Requests per Equipment Category
  const requestsPerCategory = useMemo(() => {
    const categoryCounts = {}
    requests.forEach(request => {
      const eq = equipment.find(e => e.id === request.equipmentId)
      const category = eq?.category || 'Unknown'
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })
    return Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
  }, [requests, equipment])

  // Requests by Status
  const requestsByStatus = useMemo(() => {
    const statusCounts = {}
    requests.forEach(request => {
      statusCounts[request.status] = (statusCounts[request.status] || 0) + 1
    })
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  }, [requests])

  // Requests by Type
  const requestsByType = useMemo(() => {
    const typeCounts = { Corrective: 0, Preventive: 0 }
    requests.forEach(request => {
      typeCounts[request.type] = (typeCounts[request.type] || 0) + 1
    })
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }))
  }, [requests])

  // Requests by Priority
  const requestsByPriority = useMemo(() => {
    const priorityCounts = { High: 0, Medium: 0, Low: 0 }
    requests.forEach(request => {
      priorityCounts[request.priority] = (priorityCounts[request.priority] || 0) + 1
    })
    return Object.entries(priorityCounts).map(([name, value]) => ({ name, value }))
  }, [requests])

  // Equipment Status Distribution
  const equipmentStatus = useMemo(() => {
    const statusCounts = {}
    equipment.forEach(eq => {
      const status = eq.status || 'operational'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  }, [equipment])

  const COLORS = ['#135bec', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899']

  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Reports & Analytics</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Comprehensive insights into maintenance operations</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Total Requests</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{requests.length}</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Open Requests</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {requests.filter(r => r.status !== 'Repaired' && r.status !== 'Scrap').length}
            </p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Total Equipment</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{equipment.length}</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Active Teams</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{teams.length}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requests per Team */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Requests per Team</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestsPerTeam}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="count" fill="#135bec" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Requests per Category */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Requests per Equipment Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestsPerCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Requests by Status */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Requests by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {requestsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Requests by Type */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Requests by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {requestsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Requests by Priority */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Requests by Priority</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestsByPriority}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Equipment Status */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Equipment Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={equipmentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {equipmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports

