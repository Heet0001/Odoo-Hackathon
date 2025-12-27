import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

const WorkCenters = () => {
  const { workCenters, addWorkCenter, updateWorkCenter, deleteWorkCenter } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [selectedWorkCenter, setSelectedWorkCenter] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    time: '',
    costPerHour: '',
    capacity: { unit: '', efficiency: '' },
    costTarget: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const workCenterData = {
      ...formData,
      cost: parseFloat(formData.cost) || 0,
      time: parseFloat(formData.time) || 0,
      costPerHour: parseFloat(formData.costPerHour) || 0,
      capacity: {
        unit: parseFloat(formData.capacity.unit) || 0,
        efficiency: parseFloat(formData.capacity.efficiency) || 0,
      },
      costTarget: parseFloat(formData.costTarget) || 0,
      alternativeWorkCenters: [],
    }
    
    if (selectedWorkCenter) {
      updateWorkCenter(selectedWorkCenter.id, workCenterData)
    } else {
      addWorkCenter(workCenterData)
    }
    setShowForm(false)
    setFormData({
      name: '',
      cost: '',
      time: '',
      costPerHour: '',
      capacity: { unit: '', efficiency: '' },
      costTarget: '',
    })
    setSelectedWorkCenter(null)
  }

  const handleEdit = (wc) => {
    setSelectedWorkCenter(wc)
    setFormData({
      name: wc.name || '',
      cost: wc.cost || '',
      time: wc.time || '',
      costPerHour: wc.costPerHour || '',
      capacity: {
        unit: wc.capacity?.unit || '',
        efficiency: wc.capacity?.efficiency || '',
      },
      costTarget: wc.costTarget || '',
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this work center?')) {
      deleteWorkCenter(id)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Work Centers</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Manage work centers and their capacity</p>
          </div>
          <button
            onClick={() => {
              setSelectedWorkCenter(null)
              setFormData({
                name: '',
                cost: '',
                time: '',
                costPerHour: '',
                capacity: { unit: '', efficiency: '' },
                costTarget: '',
              })
              setShowForm(true)
            }}
            className="flex items-center gap-2 justify-center rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all text-sm font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>New Work Center</span>
          </button>
        </div>

        {/* Work Centers Table */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Work Center</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cost per hour</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Capacity (Unit, Efficiency)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cost Target</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {workCenters.map((wc) => (
                  <tr key={wc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{wc.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{wc.cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{wc.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{wc.costPerHour}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {wc.capacity?.unit || 0}, {wc.capacity?.efficiency || 0}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{wc.costTarget}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(wc)}
                          className="text-primary hover:text-blue-700 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(wc.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {workCenters.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      No work centers found. Create your first work center.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedWorkCenter ? 'Edit Work Center' : 'New Work Center'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setSelectedWorkCenter(null)
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Work Center Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Time (hours)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Cost per Hour</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.costPerHour}
                      onChange={(e) => setFormData({...formData, costPerHour: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Capacity Unit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.capacity.unit}
                      onChange={(e) => setFormData({...formData, capacity: {...formData.capacity, unit: e.target.value}})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Efficiency (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.capacity.efficiency}
                      onChange={(e) => setFormData({...formData, capacity: {...formData.capacity, efficiency: e.target.value}})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Cost Target</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.costTarget}
                      onChange={(e) => setFormData({...formData, costTarget: e.target.value})}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setSelectedWorkCenter(null)
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 transition-colors"
                  >
                    {selectedWorkCenter ? 'Update' : 'Create'} Work Center
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

export default WorkCenters

