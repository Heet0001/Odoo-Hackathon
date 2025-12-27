import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const MaintenanceRequestForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { equipment, teams, addRequest, updateRequest, getEquipmentById, getTeamByName } = useApp()
  
  const [formData, setFormData] = useState({
    subject: '',
    type: 'Corrective',
    equipmentId: '',
    scheduledDate: searchParams.get('scheduledDate') || '',
    duration: '',
    durationUnit: 'Hrs',
    priority: 'Medium',
    description: '',
    assignedTeam: '',
    assignedTechnician: '',
  })

  const [autoFilled, setAutoFilled] = useState({
    category: '',
    team: '',
  })

  const isEditMode = !!id
  const selectedEquipment = formData.equipmentId ? getEquipmentById(formData.equipmentId) : null

  // Auto-fill logic when equipment is selected
  useEffect(() => {
    if (selectedEquipment) {
      setAutoFilled({
        category: selectedEquipment.category || '',
        team: selectedEquipment.maintenanceTeam || '',
      })
      // Auto-fill team if available
      if (selectedEquipment.maintenanceTeam && !formData.assignedTeam) {
        setFormData(prev => ({
          ...prev,
          assignedTeam: selectedEquipment.maintenanceTeam,
        }))
      }
    }
  }, [selectedEquipment, formData.assignedTeam])

  // Load request data if editing
  useEffect(() => {
    if (isEditMode) {
      // In a real app, you'd fetch the request by ID
      // For now, we'll handle this through context
      const request = null // You'd get this from context
      if (request) {
        setFormData({
          subject: request.subject,
          type: request.type,
          equipmentId: request.equipmentId,
          scheduledDate: request.scheduledDate,
          duration: request.duration || request.hoursSpent || '',
          durationUnit: 'Hrs',
          priority: request.priority,
          description: request.description || '',
          assignedTeam: request.assignedTeam || '',
          assignedTechnician: request.assignedTechnician || '',
        })
      }
    }
  }, [id, isEditMode])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert duration to hours if needed
    let hoursSpent = null
    if (formData.duration) {
      const durationValue = parseFloat(formData.duration)
      if (formData.durationUnit === 'Hrs') {
        hoursSpent = durationValue
      } else if (formData.durationUnit === 'Min') {
        hoursSpent = durationValue / 60
      } else if (formData.durationUnit === 'Days') {
        hoursSpent = durationValue * 8 // Assuming 8 hours per day
      }
    }
    
    const requestData = {
      subject: formData.subject,
      equipmentId: formData.equipmentId,
      equipmentName: selectedEquipment?.name || '',
      type: formData.type,
      scheduledDate: formData.scheduledDate || new Date().toISOString().split('T')[0],
      duration: formData.duration ? parseFloat(formData.duration) : null,
      hoursSpent: hoursSpent,
      priority: formData.priority,
      description: formData.description,
      assignedTeam: formData.assignedTeam,
      assignedTechnician: formData.assignedTechnician || null,
      status: 'New',
    }

    if (isEditMode) {
      updateRequest(id, requestData)
    } else {
      addRequest(requestData)
    }

    navigate('/kanban')
  }

  // Get available technicians for selected team
  const availableTechnicians = formData.assignedTeam
    ? (getTeamByName(formData.assignedTeam)?.members || [])
    : []

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Heading */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between gap-3">
            <div className="flex min-w-72 flex-col gap-2">
              <p className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Request Details</p>
              <p className="text-[#4c669a] dark:text-gray-400 text-base font-normal leading-normal">
                Provide the necessary information to initiate a maintenance ticket. Fields marked with * are required.
              </p>
            </div>
            <div className="flex items-end gap-3">
              <button
                onClick={() => navigate('/kanban')}
                className="flex items-center justify-center rounded-lg border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 transition-colors gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                Submit Request
              </button>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1a2234] rounded-xl border border-[#e7ebf3] dark:border-gray-800 shadow-sm overflow-hidden">
          {/* Section 1: Context */}
          <div className="p-6 border-b border-[#e7ebf3] dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Request Context</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Type Selector */}
              <div className="md:col-span-4 flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white">Request Type</label>
                <div className="flex h-10 w-full items-center justify-center rounded-lg bg-[#e7ebf3] dark:bg-gray-800 p-1">
                  <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all ${
                    formData.type === 'Corrective'
                      ? 'bg-white dark:bg-[#2a3449] shadow-sm text-primary'
                      : 'text-[#4c669a] dark:text-gray-400'
                  }`}>
                    <span className="truncate">Corrective</span>
                    <input
                      type="radio"
                      name="request_type"
                      value="Corrective"
                      checked={formData.type === 'Corrective'}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="invisible w-0"
                    />
                  </label>
                  <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all ${
                    formData.type === 'Preventive'
                      ? 'bg-white dark:bg-[#2a3449] shadow-sm text-primary'
                      : 'text-[#4c669a] dark:text-gray-400'
                  }`}>
                    <span className="truncate">Preventive</span>
                    <input
                      type="radio"
                      name="request_type"
                      value="Preventive"
                      checked={formData.type === 'Preventive'}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="invisible w-0"
                    />
                  </label>
                </div>
              </div>
              {/* Subject */}
              <div className="md:col-span-8 flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  required
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full h-10 rounded-lg border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-slate-900 dark:text-white placeholder-[#4c669a] dark:placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. HVAC Unit 3 Not Cooling"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Asset Identification */}
          <div className="p-6 border-b border-[#e7ebf3] dark:border-gray-800 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">precision_manufacturing</span>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Equipment Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search Asset */}
              <div className="md:col-span-2 flex flex-col gap-2 relative">
                <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="asset_search">Select Equipment *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c669a] material-symbols-outlined text-[20px]">search</span>
                  <select
                    id="asset_search"
                    required
                    value={formData.equipmentId}
                    onChange={(e) => {
                      setFormData({...formData, equipmentId: e.target.value})
                    }}
                    className="w-full h-10 rounded-lg border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">Search by name, ID, or tag...</option>
                    {equipment.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.name} ({eq.serialNumber})</option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-[#4c669a]">Selecting an asset will auto-fill category and team info.</p>
              </div>
              {/* Auto-filled Category */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1">
                  Category
                  <span className="material-symbols-outlined text-xs text-[#4c669a]" title="Auto-filled">lock</span>
                </label>
                <div className="w-full h-10 rounded-lg border border-[#e7ebf3] dark:border-gray-700 bg-[#f8f9fc] dark:bg-gray-800 px-3 flex items-center">
                  <span className="text-sm text-[#4c669a] dark:text-gray-400">{autoFilled.category || 'N/A'}</span>
                </div>
              </div>
              {/* Auto-filled Team */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1">
                  Responsible Team
                  <span className="material-symbols-outlined text-xs text-[#4c669a]" title="Auto-filled">lock</span>
                </label>
                <div className="w-full h-10 rounded-lg border border-[#e7ebf3] dark:border-gray-700 bg-[#f8f9fc] dark:bg-gray-800 px-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#4c669a]">group</span>
                  <span className="text-sm text-[#4c669a] dark:text-gray-400">{autoFilled.team || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Scheduling & Description */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Scheduling</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="date">Scheduled Date</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    className="w-full h-10 rounded-lg border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="duration">Est. Duration</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full h-10 rounded-lg border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="0"
                    />
                    <select
                      value={formData.durationUnit}
                      onChange={(e) => setFormData({...formData, durationUnit: e.target.value})}
                      className="h-10 rounded-lg border border-[#e7ebf3] dark:border-gray-700 bg-[#f8f9fc] dark:bg-gray-800 px-2 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option>Min</option>
                      <option>Hrs</option>
                      <option>Days</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white">Priority</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="High"
                      checked={formData.priority === 'High'}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm text-slate-900 dark:text-white">High</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="Medium"
                      checked={formData.priority === 'Medium'}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-slate-900 dark:text-white">Medium</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="Low"
                      checked={formData.priority === 'Low'}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm text-slate-900 dark:text-white">Low</span>
                  </label>
                </div>
              </div>
              {/* Technician Assignment */}
              {formData.assignedTeam && availableTechnicians.length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Assign Technician</label>
                  <select
                    value={formData.assignedTechnician}
                    onChange={(e) => setFormData({...formData, assignedTechnician: e.target.value})}
                    className="w-full h-10 rounded-lg border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="">Unassigned</option>
                    {availableTechnicians.map(tech => (
                      <option key={tech.id || tech.name} value={tech.name}>{tech.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="description">Description / Instructions</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full rounded-lg border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm text-slate-900 dark:text-white placeholder-[#4c669a] focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                placeholder="Describe the issue in detail, including error codes or specific sounds..."
                rows="8"
              ></textarea>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#4c669a] dark:text-gray-500 mt-8 mb-4">
          © 2023 MaintManager Inc. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default MaintenanceRequestForm

