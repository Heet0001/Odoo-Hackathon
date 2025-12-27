import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

const Teams = () => {
  const { teams, addTeam, updateTeam, addTeamMember } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    teamLead: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    addTeam({
      ...formData,
      members: [],
    })
    setShowForm(false)
    setFormData({ name: '', specialty: '', teamLead: '' })
  }

  const getAvailableCount = (team) => {
    return team.members.filter(m => m.status === 'available').length
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Team Management</h1>
            <p className="text-slate-500 dark:text-slate-400">Organize maintenance crews and assign technicians.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm shadow-primary/20"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            <span>New Team</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Teams</span>
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{teams.length}</span>
            </div>
            <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">groups</span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Technicians</span>
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {teams.reduce((sum, team) => sum + team.members.length, 0)}
              </span>
            </div>
            <div className="size-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
              <span className="material-symbols-outlined">engineering</span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Technicians On-Duty</span>
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {teams.reduce((sum, team) => sum + getAvailableCount(team), 0)}
              </span>
            </div>
            <div className="size-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <span className="material-symbols-outlined">chef_hat</span>
            </div>
          </div>
        </div>

        {/* Active Teams Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Teams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {teams.map((team) => {
              const availableCount = getAvailableCount(team)
              const totalCount = team.members.length
              return (
                <div key={team.id} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">build</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{team.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{team.specialty}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Team Lead</span>
                      <span className="font-medium text-slate-900 dark:text-white">{team.teamLead || 'Unassigned'}</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Members ({totalCount})</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          availableCount === totalCount && totalCount > 0
                            ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                            : availableCount > 0
                            ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                            : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                        }`}>
                          {totalCount === 0 ? 'No members' : 
                           availableCount === totalCount ? 'All Available' :
                           `${availableCount} Available`}
                        </span>
                      </div>
                      {team.members.length > 0 ? (
                        <div className="flex -space-x-2 overflow-hidden py-1">
                          {team.members.slice(0, 4).map((member, idx) => (
                            <div
                              key={member.id || idx}
                              className="size-8 rounded-full ring-2 ring-white dark:ring-slate-800 bg-cover bg-center"
                              style={{backgroundImage: member.avatar ? `url('${member.avatar}')` : 'none', backgroundColor: member.avatar ? 'transparent' : '#cbd5e1'}}
                            ></div>
                          ))}
                          {team.members.length > 4 && (
                            <div className="flex items-center justify-center size-8 rounded-full ring-2 ring-white dark:ring-slate-800 bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-500 dark:text-slate-300">
                              +{team.members.length - 4}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-8 flex items-center text-xs text-slate-400 italic">No members assigned</div>
                      )}
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                      <button className="flex-1 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        View Schedule
                      </button>
                      <button className="flex-1 py-2 text-sm font-medium text-white bg-primary/90 hover:bg-primary rounded-lg transition-colors shadow-sm shadow-primary/20">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Add Team Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg max-w-md w-full">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">New Team</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Team Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Specialty</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Team Lead</label>
                  <input
                    type="text"
                    value={formData.teamLead}
                    onChange={(e) => setFormData({...formData, teamLead: e.target.value})}
                    className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 transition-colors"
                  >
                    Create Team
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

export default Teams

