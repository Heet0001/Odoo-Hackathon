import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Layout = ({ children }) => {
  const location = useLocation()
  const { darkMode, setDarkMode } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Side Navigation */}
      <aside className={`flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex-shrink-0 transition-all duration-300 ${sidebarOpen ? '' : 'hidden md:flex'}`}>
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            {/* Profile / Logo Area */}
            <div className="flex gap-3 items-center px-2 py-2">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200 dark:border-slate-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC38DBKetSyBd9sCb8SLqkbkOJPAnpchIpARXT5U2bpStWBM2b1afcZhCQOga_Q_X1tj20KLtIpDR-rLGXkKCXlmlQebusoxwCjpwo2OwYOYQcOk3m5SJ_x075_OplCD_FpzsSWMgfe5Prl6xe5D9RV7n40DTaD1_QRsqShuKjpnlzPgSaPOFT-cdKWokc_GKINimlF0m6mpAqKbEd3j_fdp65mcAxuV_iw20Jyu2FSYUwA7MsBXCZgEOfu9NPVj_wcbbqCkqSawUQ")'}}></div>
              <div className="flex flex-col">
                <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">GearGuard</h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">Maintenance Manager</p>
              </div>
            </div>
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
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                <span className="material-symbols-outlined text-[24px]">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </a>
            </div>
            <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-bold leading-normal tracking-[0.015em] border border-slate-200 dark:border-slate-700">
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
            <button className="text-slate-500 hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#111827]"></span>
            </button>
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

