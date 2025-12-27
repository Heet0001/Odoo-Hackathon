import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Dashboard = () => {
  const { equipment, requests, teams } = useApp()

  const totalEquipment = equipment.length
  const openRequests = requests.filter(r => r.status !== 'Repaired' && r.status !== 'Scrap').length
  const highPriorityRequests = requests.filter(r => r.priority === 'High' && r.status !== 'Repaired' && r.status !== 'Scrap').length
  const activeTeams = teams.filter(t => t.members.length > 0).length
  const totalTeams = teams.length
  
  // Calculate maintenance due (next 48 hours)
  const now = new Date()
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000)
  const maintenanceDue = requests.filter(r => {
    if (r.type === 'Preventive' && r.status !== 'Repaired' && r.status !== 'Scrap') {
      const scheduled = new Date(r.scheduledDate)
      return scheduled >= now && scheduled <= in48Hours
    }
    return false
  }).length

  // Calculate asset status
  const operational = equipment.filter(e => e.status === 'operational').length
  const inMaintenance = equipment.filter(e => e.status === 'maintenance').length
  const broken = equipment.filter(e => e.status === 'broken').length
  const total = equipment.length
  const operationalPercent = total > 0 ? Math.round((operational / total) * 100) : 0
  const maintenancePercent = total > 0 ? Math.round((inMaintenance / total) * 100) : 0
  const brokenPercent = total > 0 ? Math.round((broken / total) * 100) : 0

  // Priority requests
  const priorityRequests = requests
    .filter(r => r.status !== 'Repaired' && r.status !== 'Scrap')
    .sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    .slice(0, 3)

  // Recent activity
  const recentActivity = requests
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  // Upcoming scheduled maintenance
  const upcomingMaintenance = requests
    .filter(r => r.type === 'Preventive' && r.status !== 'Repaired' && r.status !== 'Scrap')
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 4)

  const getStatusBadge = (status) => {
    const badges = {
      'Critical': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
      'In Progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
      'Pending': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600',
    }
    return badges[status] || badges['Pending']
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="p-6 scroll-smooth">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Dashboard Overview</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Good Morning, Manager. Here is the facility status.</p>
          </div>
          <Link 
            to="/request/new"
            className="flex items-center gap-2 justify-center rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all text-sm font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>New Request</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Equipment</p>
              <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded">inventory_2</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-slate-900 dark:text-white text-2xl font-bold">{totalEquipment}</p>
              <span className="text-green-600 text-xs font-medium bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">+2 this week</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Open Requests</p>
              <span className="material-symbols-outlined text-orange-500 bg-orange-500/10 p-1 rounded">assignment_late</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-slate-900 dark:text-white text-2xl font-bold">{openRequests}</p>
              {highPriorityRequests > 0 && (
                <span className="text-red-600 text-xs font-medium bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
                  {highPriorityRequests} High Priority
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Teams</p>
              <span className="material-symbols-outlined text-purple-500 bg-purple-500/10 p-1 rounded">groups</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-slate-900 dark:text-white text-2xl font-bold">
                {activeTeams}<span className="text-slate-400 text-lg font-normal">/{totalTeams}</span>
              </p>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">Deployed on site</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Maintenance Due</p>
              <span className="material-symbols-outlined text-blue-500 bg-blue-500/10 p-1 rounded">schedule</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-slate-900 dark:text-white text-2xl font-bold">{maintenanceDue}</p>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">Next 48h</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Table & Secondary Info */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: Priority Requests Table */}
          <div className="xl:col-span-2 flex flex-col bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-slate-900 dark:text-white font-bold text-lg">Priority Maintenance Requests</h3>
              <Link to="/kanban" className="text-primary text-sm font-medium hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Issue Type</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Team</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {priorityRequests.map((request) => {
                    const eq = equipment.find(e => e.id === request.equipmentId)
                    return (
                      <tr key={request.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{request.ticketId}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-3">
                            {eq?.image && (
                              <div className="size-8 rounded bg-slate-100 dark:bg-slate-700 bg-cover bg-center" style={{backgroundImage: `url('${eq.image}')`}}></div>
                            )}
                            <span>{request.equipmentName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{request.subject}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{request.assignedTeam || '--'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                            <span className={`size-1.5 rounded-full ${
                              request.priority === 'High' ? 'bg-red-500' : 
                              request.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></span>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/request/${request.id}`} className="text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Status & Activity */}
          <div className="flex flex-col gap-6">
            {/* Asset Status Chart */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4">Asset Status</h3>
              <div className="flex items-center justify-between">
                <div className="relative size-32 rounded-full flex items-center justify-center" style={{
                  background: `conic-gradient(#135bec 0% ${operationalPercent}%, #f59e0b ${operationalPercent}% ${operationalPercent + maintenancePercent}%, #ef4444 ${operationalPercent + maintenancePercent}% 100%)`
                }}>
                  <div className="size-24 bg-white dark:bg-[#1e293b] rounded-full flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{total}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">Total</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-primary"></span>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">Operational</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{operationalPercent}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-yellow-500"></span>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">Maintenance</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{maintenancePercent}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-red-500"></span>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">Broken</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{brokenPercent}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex-1">
              <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4">Recent Activity</h3>
              <div className="relative pl-2 border-l border-slate-200 dark:border-slate-700 space-y-6">
                {recentActivity.map((request, idx) => (
                  <div key={request.id} className="relative pl-6">
                    <div className={`absolute -left-[5px] top-1.5 size-2.5 rounded-full ring-4 ring-white dark:ring-[#1e293b] ${
                      request.status === 'Repaired' ? 'bg-green-500' : 
                      request.status === 'In Progress' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                    }`}></div>
                    <p className="text-sm text-slate-900 dark:text-white font-medium">
                      {request.status === 'Repaired' ? 'Maintenance Completed' : 
                       request.status === 'New' ? 'New ticket created' : 
                       'Ticket updated'} {request.ticketId}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{request.equipmentName} - {request.subject}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <Link to="/kanban" className="w-full mt-6 py-2 text-sm text-primary font-medium hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors block text-center">
                View Activity Log
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row: Maintenance Schedule Preview */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">Upcoming Scheduled Maintenance (48h)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
            {upcomingMaintenance.map((request) => {
              const date = new Date(request.scheduledDate)
              return (
                <Link 
                  key={request.id}
                  to={`/request/${request.id}`}
                  className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center size-12 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold uppercase text-slate-500">{formatDate(request.scheduledDate).split(' ')[0]}</span>
                    <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{request.equipmentName}</p>
                    <p className="text-xs text-slate-500">{request.subject}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400 py-4">
          © 2024 GearGuard Maintenance Systems. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

export default Dashboard

