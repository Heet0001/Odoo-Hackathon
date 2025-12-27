import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

const EquipmentCategories = () => {
  const { equipmentCategories, addEquipmentCategory, updateEquipmentCategory, deleteEquipmentCategory } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    keywords: '',
    company: 'My Company (Our Branch)',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedCategory) {
      updateEquipmentCategory(selectedCategory.id, formData)
    } else {
      addEquipmentCategory(formData)
    }
    setShowForm(false)
    setFormData({ name: '', keywords: '', company: 'My Company (Our Branch)' })
    setSelectedCategory(null)
  }

  const handleEdit = (category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name || '',
      keywords: category.keywords || '',
      company: category.company || 'My Company (Our Branch)',
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteEquipmentCategory(id)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Equipment Categories</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Define and manage equipment categories</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(null)
              setFormData({ name: '', keywords: '', company: 'My Company (Our Branch)' })
              setShowForm(true)
            }}
            className="flex items-center gap-2 justify-center rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all text-sm font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>New Category</span>
          </button>
        </div>

        {/* Categories Table */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Keywords</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {equipmentCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{category.keywords}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{category.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-primary hover:text-blue-700 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {equipmentCategories.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      No categories found. Create your first category.
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
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg max-w-md w-full">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedCategory ? 'Edit Category' : 'New Category'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setSelectedCategory(null)
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Keywords</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                    placeholder="e.g. asset, property"
                    className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
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
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setSelectedCategory(null)
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 transition-colors"
                  >
                    {selectedCategory ? 'Update' : 'Create'} Category
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

export default EquipmentCategories

