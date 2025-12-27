import React, { useState, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Equipment = () => {
  const { equipment, addEquipment, updateEquipment, deleteEquipment, getEquipmentRequests, getOpenRequestsCount, equipmentCategories, teams, workCenters } = useApp()
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [groupBy, setGroupBy] = useState('none') // 'none', 'department', 'employee', 'team'
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [activeTab, setActiveTab] = useState('new') // 'new' or 'component'
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: '',
    company: 'My Company (Our Branch)',
    usedBy: '',
    department: '',
    employee: '',
    location: '',
    purchaseDate: '',
    warrantyInfo: '',
    maintenanceTeam: '',
    assignedTechnician: '',
    assignedDate: '',
    workCenter: '',
    status: 'operational',
    description: '',
  })

  // Filter and group equipment
  const filteredEquipment = useMemo(() => {
    let filtered = equipment.filter(eq => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = (
        eq.name.toLowerCase().includes(searchLower) ||
        eq.serialNumber.toLowerCase().includes(searchLower) ||
        eq.department?.toLowerCase().includes(searchLower) ||
        eq.employee?.toLowerCase().includes(searchLower) ||
        eq.location?.toLowerCase().includes(searchLower)
      )
      
      const matchesStatus = statusFilter === 'all' || eq.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || eq.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })

    if (groupBy === 'department') {
      const grouped = {}
      filtered.forEach(eq => {
        const dept = eq.department || 'Unassigned'
        if (!grouped[dept]) grouped[dept] = []
        grouped[dept].push(eq)
      })
      return grouped
    } else if (groupBy === 'employee') {
      const grouped = {}
      filtered.forEach(eq => {
        const emp = eq.employee || 'Unassigned'
        if (!grouped[emp]) grouped[emp] = []
        grouped[emp].push(eq)
      })
      return grouped
    } else if (groupBy === 'team') {
      const grouped = {}
      filtered.forEach(eq => {
        const team = eq.maintenanceTeam || 'Unassigned'
        if (!grouped[team]) grouped[team] = []
        grouped[team].push(eq)
      })
      return grouped
    }

    return filtered
  }, [equipment, searchTerm, groupBy, statusFilter, categoryFilter])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedEquipment) {
      updateEquipment(selectedEquipment.id, formData)
    } else {
      addEquipment(formData)
    }
    setShowForm(false)
    setFormData({
      name: '',
      serialNumber: '',
      category: '',
      company: 'My Company (Our Branch)',
      usedBy: '',
      department: '',
      employee: '',
      location: '',
      purchaseDate: '',
      warrantyInfo: '',
      maintenanceTeam: '',
      assignedTechnician: '',
      assignedDate: '',
      workCenter: '',
      status: 'operational',
      description: '',
    })
    setSelectedEquipment(null)
    setActiveTab('new')
  }

  const handleEdit = (eq) => {
    setSelectedEquipment(eq)
    setFormData({
      name: eq.name || '',
      serialNumber: eq.serialNumber || '',
      category: eq.category || '',
      company: eq.company || 'My Company (Our Branch)',
      usedBy: eq.usedBy || '',
      department: eq.department || '',
      employee: eq.employee || '',
      location: eq.location || '',
      purchaseDate: eq.purchaseDate || '',
      warrantyInfo: eq.warrantyInfo || '',
      maintenanceTeam: eq.maintenanceTeam || '',
      assignedTechnician: eq.assignedTechnician || '',
      assignedDate: eq.assignedDate || '',
      workCenter: eq.workCenter || '',
      status: eq.status || 'operational',
      description: eq.description || '',
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      deleteEquipment(id)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      operational: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      maintenance: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      broken: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      scrapped: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    }
    return colors[status] || colors.operational
  }

  // Get available technicians for selected team
  const availableTechnicians = formData.maintenanceTeam
    ? (teams.find(t => t.name === formData.maintenanceTeam)?.members || [])
    : []

  const renderEquipmentList = (equipmentList) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipmentList.map((eq) => {
          const openRequestsCount = getOpenRequestsCount(eq.id)
          return (
            <div 
              key={eq.id} 
              className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 flex-1">
                  {eq.image && (
                    <div className="size-12 rounded-lg bg-cover bg-center flex-shrink-0" style={{backgroundImage: `url('${eq.image}')`}}></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{eq.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{eq.serialNumber}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(eq)}
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(eq.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Category</span>
                  <span className="font-medium text-slate-900 dark:text-white">{eq.category || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Department</span>
                  <span className="font-medium text-slate-900 dark:text-white">{eq.department || 'N/A'}</span>
                </div>
                {eq.employee && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Employee</span>
                    <span className="font-medium text-slate-900 dark:text-white">{eq.employee}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Location</span>
                  <span className="font-medium text-slate-900 dark:text-white">{eq.location || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Team</span>
                  <span className="font-medium text-slate-900 dark:text-white">{eq.maintenanceTeam || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(eq.status)}`}>
                    {eq.status || 'operational'}
                  </span>
                </div>
              </div>

              {/* Smart Button - Maintenance */}
              <Link
                to={`/kanban?equipment=${eq.id}`}
                className="flex items-center justify-between w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">build</span>
                  <span className="text-sm font-medium text-primary">Maintenance</span>
                </div>
                {openRequestsCount > 0 && (
                  <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                    {openRequestsCount}
                  </span>
                )}
              </Link>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Equipment Management</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Track and manage all company assets</p>
          </div>
          <button
            onClick={() => {
              setSelectedEquipment(null)
              setFormData({
                name: '',
                serialNumber: '',
                category: '',
                department: '',
                employee: '',
                location: '',
                purchaseDate: '',
                warrantyInfo: '',
                maintenanceTeam: '',
                assignedTechnician: '',
              })
              setShowForm(true)
            }}
            className="flex items-center gap-2 justify-center rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all text-sm font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>New Equipment</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Search by name, serial number, department, employee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="all">All Status</option>
                <option value="operational">Operational</option>
                <option value="maintenance">Maintenance</option>
                <option value="broken">Broken</option>
                <option value="scrapped">Scrapped</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="all">All Categories</option>
                {equipmentCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="none">No Grouping</option>
                <option value="department">Group by Department</option>
                <option value="employee">Group by Employee</option>
                <option value="team">Group by Team</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment List */}
        <div className="flex flex-col gap-6">
          {groupBy === 'none' ? (
            renderEquipmentList(filteredEquipment)
          ) : (
            Object.entries(filteredEquipment).map(([group, items]) => (
              <div key={group} className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    {groupBy === 'department' ? 'business' : groupBy === 'employee' ? 'person' : 'group'}
                  </span>
                  {group}
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({items.length})</span>
                </h3>
                {renderEquipmentList(items)}
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedEquipment ? 'Edit Equipment' : 'New Equipment'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setSelectedEquipment(null)
                    setActiveTab('new')
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-slate-200 dark:border-slate-700 px-6">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('new')}
                    className={`px-4 py-2 border-b-2 transition-colors ${
                      activeTab === 'new'
                        ? 'border-primary text-primary font-medium'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('component')}
                    className={`px-4 py-2 border-b-2 transition-colors ${
                      activeTab === 'component'
                        ? 'border-primary text-primary font-medium'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Component
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Equipment Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Equipment Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select Category</option>
                      {equipmentCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Used By?</label>
                    <input
                      type="text"
                      value={formData.usedBy}
                      onChange={(e) => setFormData({...formData, usedBy: e.target.value})}
                      placeholder="Department, Employee, etc."
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Maintenance Type</label>
                    <select
                      value={formData.maintenanceTeam}
                      onChange={(e) => setFormData({...formData, maintenanceTeam: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select Team</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.name}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Assigned Date?</label>
                    <input
                      type="date"
                      value={formData.assignedDate}
                      onChange={(e) => setFormData({...formData, assignedDate: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Employee?</label>
                    <input
                      type="text"
                      value={formData.employee}
                      onChange={(e) => setFormData({...formData, employee: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Team?</label>
                    <select
                      value={formData.maintenanceTeam}
                      onChange={(e) => setFormData({...formData, maintenanceTeam: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select Team</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.name}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Status?</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="operational">Operational</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="broken">Broken</option>
                      <option value="scrapped">Scrapped</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Work Center?</label>
                    <select
                      value={formData.workCenter}
                      onChange={(e) => setFormData({...formData, workCenter: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select Work Center</option>
                      {workCenters.map(wc => (
                        <option key={wc.id} value={wc.name}>{wc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Serial Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Purchase Date</label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Warranty Information</label>
                    <input
                      type="text"
                      value={formData.warrantyInfo}
                      onChange={(e) => setFormData({...formData, warrantyInfo: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  {formData.maintenanceTeam && availableTechnicians.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Assigned Technician</label>
                      <select
                        value={formData.assignedTechnician}
                        onChange={(e) => setFormData({...formData, assignedTechnician: e.target.value})}
                        className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      >
                        <option value="">Unassigned</option>
                        {availableTechnicians.map(tech => (
                          <option key={tech.id || tech.name} value={tech.name}>{tech.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setSelectedEquipment(null)
                      setActiveTab('new')
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 transition-colors"
                  >
                    {selectedEquipment ? 'Update' : 'Create'} Equipment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Equipment

