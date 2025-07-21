import React, { useState, useCallback, useMemo } from 'react'
import { useTheme } from '../ThemeProvider'
import { useCompositeNodes } from '../../contexts/CompositeNodeContext'
import { EditCompositeModal } from '../modals/EditCompositeModal'
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal'
import { CreateCompositeModalNew } from '../modals/CreateCompositeModalNew'
import { CompositeNodesTable } from './CompositeNodesTable'
import type { CompositeNode } from '../../types'

interface CompositeNodesTabProps {
  onEditComposite: (compositeId: string) => void
}

export const CompositeNodesTab: React.FC<CompositeNodesTabProps> = ({ onEditComposite }) => {
  const { isDark } = useTheme()
  const { compositeNodes, deleteCompositeNode, toggleCompositePublished, exportCompositeNodes, importCompositeNodes } = useCompositeNodes()
  
  // Filter and selection state
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [selectedCompositeNodes, setSelectedCompositeNodes] = useState<Set<string>>(new Set())
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingComposite, setEditingComposite] = useState<CompositeNode | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingComposite, setDeletingComposite] = useState<CompositeNode | null>(null)
  
  // Import/Export states
  const [importError, setImportError] = useState<string>('')
  const [importSuccess, setImportSuccess] = useState<string>('')

  // Filter composite nodes based on current filter
  const filteredCompositeNodes = useMemo(() => {
    switch (filter) {
      case 'published':
        return compositeNodes.filter(composite => composite.published)
      case 'draft':
        return compositeNodes.filter(composite => !composite.published)
      default:
        return compositeNodes
    }
  }, [compositeNodes, filter])

  // Handle filter change
  const handleFilterChange = useCallback((newFilter: 'all' | 'published' | 'draft') => {
    setFilter(newFilter)
    setSelectedCompositeNodes(new Set()) // Clear selection when filter changes
  }, [])

  // Handle composite selection
  const handleCompositeSelection = useCallback((compositeId: string, selected: boolean) => {
    setSelectedCompositeNodes(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(compositeId)
      } else {
        newSet.delete(compositeId)
      }
      return newSet
    })
  }, [])

  // Handle select all
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedCompositeNodes(new Set(filteredCompositeNodes.map(c => c.id)))
    } else {
      setSelectedCompositeNodes(new Set())
    }
  }, [filteredCompositeNodes])

  // Handle create composite
  const handleCreateComposite = useCallback(() => {
    setShowCreateModal(true)
  }, [])

  const handleCreateModalClose = useCallback(() => {
    setShowCreateModal(false)
  }, [])

  const handleCreateModalSubmit = useCallback((name: string, description: string, connectionType: 'input' | 'output' | 'input/output', icon: string, category: string, color: string) => {
    setShowCreateModal(false)
    // Navigate to the composite editor with form data using query parameters
    const queryParams = new URLSearchParams({
      name: name,
      description: description,
      connectionType: connectionType,
      icon: icon,
      category: category,
      color: color
    })
    onEditComposite(`new?${queryParams.toString()}`)
  }, [onEditComposite])

  // Handle open composite
  const handleOpenComposite = useCallback((compositeId: string) => {
    onEditComposite(compositeId)
  }, [onEditComposite])

  // Handle edit composite
  const handleEditComposite = useCallback((composite: CompositeNode) => {
    setEditingComposite(composite)
    setShowEditModal(true)
  }, [])

  // Handle toggle publish
  const handleTogglePublish = useCallback((compositeId: string) => {
    toggleCompositePublished(compositeId)
  }, [toggleCompositePublished])

  // Handle delete composite
  const handleDeleteComposite = useCallback((compositeId: string) => {
    const composite = compositeNodes.find(c => c.id === compositeId)
    if (composite) {
      setDeletingComposite(composite)
      setShowDeleteModal(true)
    }
  }, [compositeNodes])

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(() => {
    if (deletingComposite) {
      deleteCompositeNode(deletingComposite.id)
      setDeletingComposite(null)
      setShowDeleteModal(false)
      setSelectedCompositeNodes(new Set())
    }
  }, [deletingComposite, deleteCompositeNode])

  // Handle delete cancel
  const handleDeleteCancel = useCallback(() => {
    setDeletingComposite(null)
    setShowDeleteModal(false)
  }, [])

  // Handle export
  const handleExport = useCallback(() => {
    try {
      const compositesToExport = selectedCompositeNodes.size > 0 
        ? compositeNodes.filter(c => selectedCompositeNodes.has(c.id))
        : compositeNodes
      
      if (compositesToExport.length === 0) {
        throw new Error('No composite nodes selected for export')
      }

      exportCompositeNodes(compositesToExport.map(c => c.id))
    } catch (error) {
      
    }
  }, [selectedCompositeNodes, compositeNodes, exportCompositeNodes])

  // Handle import
  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedComposites = JSON.parse(content) as CompositeNode[]
        
        importCompositeNodes(importedComposites)
        setImportSuccess(`Successfully imported ${importedComposites.length} composite node(s)`)
        setImportError('')
        
        // Clear success message after 3 seconds
        setTimeout(() => setImportSuccess(''), 3000)
      } catch (error) {
        setImportError('Failed to import composite nodes. Please check the file format.')
        setImportSuccess('')
      }
    }
    reader.readAsText(file)
    
    // Reset input
    event.target.value = ''
  }, [importCompositeNodes])

  // Handle edit modal close
  const handleEditModalClose = useCallback(() => {
    setShowEditModal(false)
    setEditingComposite(null)
  }, [])

  return (
    <>
      {/* Composite Nodes Tab Header with Export/Import */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? isDark 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-600 text-white'
                : isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Composites ({compositeNodes.length})
          </button>
          <button
            onClick={() => handleFilterChange('published')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'published'
                ? isDark 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-600 text-white'
                : isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🟢 Published ({compositeNodes.filter(c => c.published).length})
          </button>
          <button
            onClick={() => handleFilterChange('draft')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'draft'
                ? isDark 
                  ? 'bg-gray-500 text-white' 
                  : 'bg-gray-600 text-white'
                : isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ⚪ Drafts ({compositeNodes.filter(c => !c.published).length})
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCreateComposite}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            + Create Composite
          </button>
          <button
            onClick={handleExport}
            disabled={compositeNodes.length === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              compositeNodes.length === 0
                ? isDark 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isDark 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <label className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer ${
            isDark 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Import Error/Success Display */}
      {importError && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{importError}</p>
        </div>
      )}
      {importSuccess && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
          <p className="text-green-700 dark:text-green-300 text-sm">{importSuccess}</p>
        </div>
      )}

      {/* Composite Nodes Table */}
      <CompositeNodesTable
        compositeNodes={compositeNodes}
        filteredCompositeNodes={filteredCompositeNodes}
        selectedCompositeNodes={selectedCompositeNodes}
        onCompositeSelection={handleCompositeSelection}
        onSelectAll={handleSelectAll}
        onOpenComposite={handleOpenComposite}
        onEditComposite={handleEditComposite}
        onTogglePublish={handleTogglePublish}
        onDeleteComposite={handleDeleteComposite}
        onCreateComposite={handleCreateComposite}
      />

      {/* Create Composite Modal */}
      <CreateCompositeModalNew
        isOpen={showCreateModal}
        onClose={handleCreateModalClose}
        onSubmit={handleCreateModalSubmit}
      />

      {/* Edit Composite Modal */}
      <EditCompositeModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        compositeNode={editingComposite}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Composite Node"
        message="Are you sure you want to delete this composite node? This action cannot be undone."
        itemName={deletingComposite?.name || ''}
        itemType="Composite Node"
      />
    </>
  )
} 