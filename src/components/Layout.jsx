import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Layout = ({ children }) => {
  const location = useLocation()
  const { darkMode, setDarkMode, currentUser, logout, requests } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  // Get overdue and high priority requests
  const overdueRequests = requests.filter(r => r.overdue && r.status !== 'Repaired' && r.status !== 'Scrap')
  const highPriorityRequests = requests.filter(r => 
    r.priority === 'High' && 
    r.status !== 'Repaired' && 
    r.status !== 'Scrap' &&
    !r.overdue
  ).slice(0, 3)
  const allNotifications = [...overdueRequests, ...highPriorityRequests].slice(0, 5)
  const unreadCount = allNotifications.length

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Side Navigation */}
      <aside className={`flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex-shrink-0 transition-all duration-300 ${sidebarOpen ? '' : 'hidden md:flex'}`}>
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            {/* Profile / Logo Area */}
            <Link to="/profile" className="flex gap-3 items-center px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-primary text-white" style={{backgroundImage: currentUser?.avatar ? `url(${currentUser.avatar})` : 'none'}}>
                {!currentUser?.avatar && <span className="material-symbols-outlined text-[24px]">person</span>}
              </div>
              <div className="flex flex-col">
                <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">{currentUser?.name || 'GearGuard'}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">{currentUser?.role || 'Maintenance Manager'}</p>
              </div>
            </Link>
            {/* Navigation Links */}
            <nav className="flex flex-col gap-2 mt-4">
              <Link 
                to="/" 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">dashboard</span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link 
                to="/equipment" 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive('/equipment') && !isActive('/equipment-categories') && !isActive('/work-centers')
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">build</span>
                <p className="text-sm font-medium leading-normal">Equipment</p>
              </Link>
              <Link 
                to="/equipment-categories" 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ml-4 ${
                  isActive('/equipment-categories')
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">category</span>
                <p className="text-sm font-medium leading-normal">Categories</p>
              </Link>
              <Link 
                to="/work-centers" 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ml-4 ${
                  isActive('/work-centers')
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
                <p className="text-sm font-medium leading-normal">Work Centers</p>
              </Link>
              <Link 
                to="/teams" 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive('/teams')
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">group</span>
                <p className="text-sm font-medium leading-normal">Teams</p>
              </Link>
              <Link 
                to="/kanban" 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive('/kanban')
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">assignment</span>
                <p className="text-sm font-medium leading-normal">Maintenance</p>
              </Link>
              <Link 
                to="/calendar" 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive('/calendar')
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                <p className="text-sm font-medium leading-normal">Calendar</p>
              </Link>
              <Link 
                to="/reports" 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive('/reports')
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">description</span>
                <p className="text-sm font-medium leading-normal">Reports</p>
              </Link>
            </nav>
          </div>
          {/* Bottom Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {darkMode ? 'light_mode' : 'dark_mode'}
                </span>
                <p className="text-sm font-medium leading-normal">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </p>
              </button>
              <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="/profile">
                <span className="material-symbols-outlined text-[24px]">account_circle</span>
                <p className="text-sm font-medium leading-normal">Profile</p>
              </Link>
            </div>
            <button 
              onClick={() => { logout(); window.location.href = '/login'; }}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-red-500 hover:text-white transition-colors text-sm font-bold leading-normal tracking-[0.015em] border border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">logout</span>
              <span className="truncate">Log Out</span>
            </button>
          </div>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex-shrink-0 z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <Link to="/" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium leading-normal">Home</Link>
            <span className="text-slate-400 text-sm font-medium leading-normal">/</span>
            <span className="text-slate-900 dark:text-white text-sm font-medium leading-normal capitalize">
              {location.pathname.split('/').filter(Boolean)[0] || 'Dashboard'}
            </span>
          </div>
          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-6 hidden md:block">
            <label className="flex flex-col w-full">
              <div className="flex w-full items-center rounded-lg h-10 bg-slate-100 dark:bg-slate-800 focus-within:ring-2 ring-primary/50 transition-all overflow-hidden border border-transparent focus-within:border-primary/50">
                <div className="text-slate-400 flex items-center justify-center pl-3">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 h-full px-3 text-sm" 
                  placeholder="Search asset IDs or ticket numbers..." 
                />
              </div>
            </label>
          </div>
          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-slate-500 hover:text-primary transition-colors relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full border-2 border-white dark:border-[#111827] flex items-center justify-center text-white text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                  </div>
                  {allNotifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                      <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                      <p className="text-sm">No new notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                      {allNotifications.map(req => (
                        <Link
                          key={req.id}
                          to={`/request/${req.id}`}
                          onClick={() => setShowNotifications(false)}
                          className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className={`material-symbols-outlined text-2xl ${
                            req.overdue ? 'text-red-500' : 'text-orange-500'
                          }`}>
                            {req.overdue ? 'warning' : 'priority_high'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {req.overdue ? 'Overdue: ' : 'High Priority: '}{req.subject}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {req.equipmentName}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {req.overdue ? `Due: ${req.scheduledDate}` : `Scheduled: ${req.scheduledDate}`}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                    <Link
                      to="/kanban"
                      onClick={() => setShowNotifications(false)}
                      className="block text-center text-sm text-primary hover:text-blue-700 font-medium"
                    >
                      View all maintenance requests
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCfE65f3-2vtosqqocOHZdyIRbmJAESASXATHeOZ0cYtaOarsKUWRaWSkFe6cdKeXw7nqgZMW4wDD2bsQ7j1HI5OqW6q7W4xY4q3NVlF3Yl9JgIE876o56tBCXMP8XDqOisg9jKOkajt6hyWYw5AOybRbTmRQTfhgmpWRwG4gYKClQ8UwiILxtQpdvPizvXMVqkbfyTh9L2DfJKR3Iax1Glcbg4dDfEYsSCy8Av4AddqX1ngeWrMqqIJOHuYwQUcqXnGSnVnXMTd2Q\')'}}></div>
          </div>
        </header>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout

