import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Profile = () => {
  const navigate = useNavigate()
  const { currentUser, updateProfile, logout } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    role: currentUser?.role || '',
    team: currentUser?.team || '',
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = updateProfile(formData)
    if (success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } else {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Profile Settings</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Manage your account information and preferences</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header Section with Avatar */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute -bottom-16 left-8 flex items-end gap-4">
              <div className="size-32 rounded-full border-4 border-white dark:border-[#1e293b] bg-primary flex items-center justify-center text-white shadow-xl">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Profile" className="size-full rounded-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[64px]">person</span>
                )}
              </div>
              <button className="mb-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                Change Photo
              </button>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="pt-20 p-8">
            {/* Message */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg border flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400'
              }`}>
                <span className="material-symbols-outlined text-[20px]">
                  {message.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Role and Team */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={formData.role}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">Contact admin to change your role</p>
                </div>

                <div>
                  <label htmlFor="team" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Team
                  </label>
                  <input
                    type="text"
                    id="team"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Account Info */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="material-symbols-outlined text-primary">badge</span>
                    <div>
                      <p className="text-xs text-slate-500">User ID</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{currentUser?.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                    <div>
                      <p className="text-xs text-slate-500">Member Since</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">save</span>
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          name: currentUser?.name || '',
                          email: currentUser?.email || '',
                          role: currentUser?.role || '',
                          team: currentUser?.team || '',
                        })
                      }}
                      className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg transition-all border border-slate-300 dark:border-slate-600"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-red-200 dark:border-red-800 overflow-hidden">
          <div className="p-6 bg-red-50 dark:bg-red-900/10 border-b border-red-200 dark:border-red-800">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-400 flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              Danger Zone
            </h3>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-900 dark:text-white font-medium">Log out of your account</p>
                <p className="text-sm text-slate-500">You'll need to sign in again to access GearGuard</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
