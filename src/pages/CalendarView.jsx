import React, { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const CalendarView = () => {
  const { requests, equipment } = useApp()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  // Get preventive maintenance requests
  const preventiveRequests = useMemo(() => {
    return requests.filter(r => r.type === 'Preventive' && r.status !== 'Repaired' && r.status !== 'Scrap')
  }, [requests])

  // Group requests by date
  const requestsByDate = useMemo(() => {
    const grouped = {}
    preventiveRequests.forEach(request => {
      const dateKey = request.scheduledDate
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(request)
    })
    return grouped
  }, [preventiveRequests])

  // Get calendar days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const getDateRequests = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return requestsByDate[dateKey] || []
  }

  const isToday = (date) => {
    return isSameDay(date, new Date())
  }

  const isSelected = (date) => {
    return selectedDate && isSameDay(date, selectedDate)
  }

  const isOverdue = (date) => {
    return date < new Date() && !isSameDay(date, new Date())
  }

  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Maintenance Calendar</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">View and schedule preventive maintenance requests</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToday}
              className="flex items-center gap-2 justify-center rounded-lg h-10 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              Today
            </button>
            <Link
              to="/request/new"
              className="flex items-center gap-2 justify-center rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all text-sm font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>New Request</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, idx) => {
                const dayRequests = getDateRequests(day)
                const inCurrentMonth = isSameMonth(day, currentDate)
                const dayIsToday = isToday(day)
                const dayIsSelected = isSelected(day)
                const dayIsOverdue = isOverdue(day) && dayRequests.length > 0

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      handleDateClick(day)
                      if (dayRequests.length === 0) {
                        // Navigate to create new request for this date
                        // You could pass date as query param
                      }
                    }}
                    className={`
                      min-h-[80px] p-2 rounded-lg border cursor-pointer transition-all
                      ${!inCurrentMonth ? 'opacity-30' : ''}
                      ${dayIsToday ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700'}
                      ${dayIsSelected ? 'ring-2 ring-primary bg-primary/10' : ''}
                      ${dayIsOverdue ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' : ''}
                      hover:bg-slate-50 dark:hover:bg-slate-800
                    `}
                  >
                    <div className={`text-sm font-medium mb-1 ${inCurrentMonth ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                      {format(day, 'd')}
                    </div>
                    {dayRequests.length > 0 && (
                      <div className="space-y-1">
                        {dayRequests.slice(0, 2).map(request => (
                          <div
                            key={request.id}
                            className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-300 truncate"
                            title={request.subject}
                          >
                            {request.equipmentName}
                          </div>
                        ))}
                        {dayRequests.length > 2 && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            +{dayRequests.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar - Selected Date Details */}
          <div className="flex flex-col gap-6">
            {selectedDate ? (
              <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                {getDateRequests(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {getDateRequests(selectedDate).map(request => {
                      const eq = equipment.find(e => e.id === request.equipmentId)
                      return (
                        <Link
                          key={request.id}
                          to={`/request/${request.id}`}
                          className="block p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{request.equipmentName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {request.priority}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{request.subject}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined text-[16px]">group</span>
                            <span>{request.assignedTeam || 'Unassigned'}</span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">event_available</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No scheduled maintenance</p>
                    <Link
                      to="/request/new"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Schedule Maintenance
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">Click on a date to view scheduled maintenance</p>
              </div>
            )}

            {/* Upcoming Maintenance */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Maintenance</h3>
              <div className="space-y-3">
                {preventiveRequests
                  .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
                  .slice(0, 5)
                  .map(request => (
                    <Link
                      key={request.id}
                      to={`/request/${request.id}`}
                      className="block p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {format(new Date(request.scheduledDate), 'MMM d')}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {request.priority}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{request.equipmentName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{request.subject}</p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView

