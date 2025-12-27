import React, { useState, useMemo } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const RequestCard = ({ request, equipment, teams, onAssign }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'request',
    item: { id: request.id, status: request.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const eq = equipment.find(e => e.id === request.equipmentId)
  const team = teams.find(t => t.name === request.assignedTeam)
  const technician = team?.members.find(m => m.name === request.assignedTechnician)

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'bg-red-500',
      Medium: 'bg-orange-500',
      Low: 'bg-green-500',
    }
    return colors[priority] || 'bg-gray-500'
  }

  const isOverdue = request.overdue || (request.scheduledDate && new Date(request.scheduledDate) < new Date() && request.status !== 'Repaired' && request.status !== 'Scrap')

  return (
    <div
      ref={drag}
      className={`bg-white dark:bg-[#1a2332] rounded-lg p-4 shadow-sm border ${
        isOverdue ? 'border-l-4 border-l-red-500 shadow-[0_4px_6px_-1px_rgba(239,68,68,0.1)]' : 'border-transparent hover:border-primary/50'
      } cursor-grab active:cursor-grabbing group transition-all ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-gray-500 font-mono">{request.ticketId}</span>
        <div className="flex items-center gap-1">
          {isOverdue && (
            <div className="flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Overdue
            </div>
          )}
          <div className={`h-1.5 w-1.5 rounded-full ${getPriorityColor(request.priority)}`} title={`${request.priority} Priority`}></div>
        </div>
      </div>
      <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">{request.equipmentName}</h4>
      <p className="text-gray-600 dark:text-gray-400 text-xs mb-4 line-clamp-2">{request.subject}</p>
      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
        <div className="flex -space-x-2">
          {technician ? (
            <div
              className="size-6 rounded-full bg-gray-200 dark:bg-gray-700 border border-white dark:border-gray-800 bg-cover bg-center"
              style={{backgroundImage: technician.avatar ? `url('${technician.avatar}')` : 'none'}}
              title={technician.name}
            ></div>
          ) : (
            <div className="size-6 rounded-full bg-gray-200 dark:bg-gray-700 border border-white dark:border-gray-800 flex items-center justify-center text-[10px] text-gray-500">?</div>
          )}
        </div>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 px-2 py-1 rounded text-[11px] font-medium">
          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
          <span>{new Date(request.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  )
}

const KanbanColumn = ({ status, title, requests, equipment, teams, onDrop, onAssign }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'request',
    drop: (item) => {
      if (item.status !== status) {
        onDrop(item.id, status)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-gray-400',
      'In Progress': 'bg-primary animate-pulse',
      'Repaired': 'bg-green-500',
      'Scrap': 'bg-gray-600',
    }
    return colors[status] || 'bg-gray-400'
  }

  return (
    <div className="flex flex-col w-1/4 min-w-[280px] h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${getStatusColor(status)}`}></div>
          <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">{title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            status === 'In Progress' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-[#e7ebf3] dark:bg-gray-700 text-[#4c669a] dark:text-gray-300'
          }`}>
            {requests.length}
          </span>
        </div>
      </div>
      <div
        ref={drop}
        className={`flex-1 flex flex-col gap-3 overflow-y-auto pr-2 pb-2 rounded-lg transition-colors ${
          isOver ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
        }`}
      >
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            equipment={equipment}
            teams={teams}
            onAssign={onAssign}
          />
        ))}
      </div>
    </div>
  )
}

const KanbanBoard = () => {
  const { requests, equipment, teams, updateRequest, handleRequestScrap } = useApp()
  const [searchParams] = useSearchParams()
  const equipmentFilter = searchParams.get('equipment')
  const [filterTechnician, setFilterTechnician] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterAssetType, setFilterAssetType] = useState('All')

  // Filter requests
  const filteredRequests = useMemo(() => {
    let filtered = requests

    if (equipmentFilter) {
      filtered = filtered.filter(r => r.equipmentId === equipmentFilter)
    }

    if (filterTechnician !== 'All') {
      filtered = filtered.filter(r => r.assignedTechnician === filterTechnician)
    }

    if (filterPriority !== 'All') {
      filtered = filtered.filter(r => r.priority === filterPriority)
    }

    if (filterAssetType !== 'All') {
      const eq = equipment.find(e => e.category === filterAssetType)
      if (eq) {
        filtered = filtered.filter(r => {
          const reqEq = equipment.find(e => e.id === r.equipmentId)
          return reqEq?.category === filterAssetType
        })
      }
    }

    return filtered
  }, [requests, equipmentFilter, filterTechnician, filterPriority, filterAssetType, equipment])

  // Group requests by status
  const requestsByStatus = useMemo(() => {
    const statuses = ['New', 'In Progress', 'Repaired', 'Scrap']
    const grouped = {}
    statuses.forEach(status => {
      grouped[status] = filteredRequests.filter(r => r.status === status)
    })
    return grouped
  }, [filteredRequests])

  const handleDrop = (requestId, newStatus) => {
    updateRequest(requestId, { status: newStatus })
    
    // If moving to Scrap, handle equipment status
    if (newStatus === 'Scrap') {
      handleRequestScrap(requestId)
    }
  }

  const handleAssign = (requestId, technicianName) => {
    updateRequest(requestId, { 
      assignedTechnician: technicianName,
      status: requestId.status === 'New' ? 'In Progress' : requestId.status
    })
  }

  // Get all technicians for filter
  const allTechnicians = useMemo(() => {
    const techs = new Set()
    teams.forEach(team => {
      team.members.forEach(member => {
        techs.add(member.name)
      })
    })
    return Array.from(techs)
  }, [teams])

  // Get all asset types for filter
  const allAssetTypes = useMemo(() => {
    const types = new Set()
    equipment.forEach(eq => {
      if (eq.category) types.add(eq.category)
    })
    return Array.from(types)
  }, [equipment])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="px-6 py-6 shrink-0 flex flex-col gap-6">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Maintenance Board</h1>
              <p className="text-[#4c669a] dark:text-gray-400 text-sm font-normal leading-normal">
                {equipmentFilter ? 'Filtered by equipment' : 'Manage requests, assign technicians, and track progress across the facility.'}
              </p>
            </div>
            <Link
              to="/request/new"
              className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-blue-500/20"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="truncate">New Request</span>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4c669a] dark:text-gray-500 mr-2">Filter by:</span>
            <select
              value={filterTechnician}
              onChange={(e) => setFilterTechnician(e.target.value)}
              className="group flex h-8 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-[#e7ebf3] dark:border-gray-700 pl-3 pr-2 hover:border-primary dark:hover:border-primary transition-colors shadow-sm text-xs font-medium text-slate-900 dark:text-white"
            >
              <option value="All">Technician: All</option>
              {allTechnicians.map(tech => (
                <option key={tech} value={tech}>Technician: {tech}</option>
              ))}
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="group flex h-8 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-[#e7ebf3] dark:border-gray-700 pl-3 pr-2 hover:border-primary dark:hover:border-primary transition-colors shadow-sm text-xs font-medium text-slate-900 dark:text-white"
            >
              <option value="All">Priority: All</option>
              <option value="High">Priority: High</option>
              <option value="Medium">Priority: Medium</option>
              <option value="Low">Priority: Low</option>
            </select>
            <select
              value={filterAssetType}
              onChange={(e) => setFilterAssetType(e.target.value)}
              className="group flex h-8 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-[#e7ebf3] dark:border-gray-700 pl-3 pr-2 hover:border-primary dark:hover:border-primary transition-colors shadow-sm text-xs font-medium text-slate-900 dark:text-white"
            >
              <option value="All">Asset Type: All</option>
              {allAssetTypes.map(type => (
                <option key={type} value={type}>Asset Type: {type}</option>
              ))}
            </select>
            {(filterTechnician !== 'All' || filterPriority !== 'All' || filterAssetType !== 'All' || equipmentFilter) && (
              <button
                onClick={() => {
                  setFilterTechnician('All')
                  setFilterPriority('All')
                  setFilterAssetType('All')
                }}
                className="ml-auto text-sm text-[#4c669a] hover:text-primary underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Kanban Board Columns */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-6">
          <div className="flex h-full gap-6 min-w-[1000px]">
            <KanbanColumn
              status="New"
              title="New Requests"
              requests={requestsByStatus.New || []}
              equipment={equipment}
              teams={teams}
              onDrop={handleDrop}
              onAssign={handleAssign}
            />
            <KanbanColumn
              status="In Progress"
              title="In Progress"
              requests={requestsByStatus['In Progress'] || []}
              equipment={equipment}
              teams={teams}
              onDrop={handleDrop}
              onAssign={handleAssign}
            />
            <KanbanColumn
              status="Repaired"
              title="Repaired"
              requests={requestsByStatus.Repaired || []}
              equipment={equipment}
              teams={teams}
              onDrop={handleDrop}
              onAssign={handleAssign}
            />
            <KanbanColumn
              status="Scrap"
              title="Scrap / Salvage"
              requests={requestsByStatus.Scrap || []}
              equipment={equipment}
              teams={teams}
              onDrop={handleDrop}
              onAssign={handleAssign}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

export default KanbanBoard

