import React, { useState, useCallback } from 'react'
import { useTheme } from './ThemeProvider'
import { useFlowManager } from '../contexts/FlowManagerContext'
import { useDynamicNodes } from '../contexts/DynamicNodeContext'
import { Header } from './Header'
import { ValidationModal } from './modals/ValidationModal'
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal'
import { DynamicNodeEditorModal } from './modals/DynamicNodeEditorModal'
import type { Flow, FlowValidationResult, DynamicNodeType } from '../types'

interface DashboardProps {
  onOpenFlow: (flowId: string) => void
}

/**
 * Dashboard component with flows management
 */
export const Dashboard: React.FC<DashboardProps> = ({ onOpenFlow }) => {
  const { isDark } = useTheme()
  const { flows, createFlow, deleteFlow, toggleFlowPublished, updateFlowStats, updateFlow } = useFlowManager()
  const { dynamicNodeTypes, deleteDynamicNodeType, importDynamicNodeTypes, exportDynamicNodeTypes } = useDynamicNodes()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingFlow, setEditingFlow] = useState<Flow | null>(null)
  const [newFlowName, setNewFlowName] = useState('')
  const [newFlowDescription, setNewFlowDescription] = useState('')
  const [createError, setCreateError] = useState<string>('')
  const [editError, setEditError] = useState<string>('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [importError, setImportError] = useState<string>('')
  const [importSuccess, setImportSuccess] = useState<string>('')
  const [selectedNodeTypes, setSelectedNodeTypes] = useState<Set<string>>(new Set())
  const [nodeTypeImportError, setNodeTypeImportError] = useState<string>('')
  const [nodeTypeImportSuccess, setNodeTypeImportSuccess] = useState<string>('')
  const [selectedFlows, setSelectedFlows] = useState<Set<string>>(new Set())
  const [showNodeEditor, setShowNodeEditor] = useState(false)
  const [editingNodeType, setEditingNodeType] = useState<DynamicNodeType | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'flows' | 'customNodes'>('flows')

  // Validation modal state
  const [validationModal, setValidationModal] = useState<{
    isOpen: boolean
    flowId: string
    flowName: string
    validationResult: FlowValidationResult | null
  }>({
    isOpen: false,
    flowId: '',
    flowName: '',
    validationResult: null
  })

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    flowId: string
    flowName: string
  }>({
    isOpen: false,
    flowId: '',
    flowName: ''
  })

  // Node type delete confirmation modal state
  const [nodeTypeDeleteModal, setNodeTypeDeleteModal] = useState<{
    isOpen: boolean
    nodeTypeId: string
    nodeTypeName: string
  }>({
    isOpen: false,
    nodeTypeId: '',
    nodeTypeName: ''
  })

  // Filter flows based on selected filter
  const filteredFlows = flows.filter(flow => {
    switch (filter) {
      case 'published':
        return flow.published
      case 'draft':
        return !flow.published
      default:
        return true
    }
  })

  const handleCreateFlow = useCallback(() => {
    if (newFlowName.trim()) {
      try {
        const newFlow = createFlow(newFlowName.trim(), newFlowDescription.trim() || undefined)
        setShowCreateModal(false)
        setNewFlowName('')
        setNewFlowDescription('')
        setCreateError('')
        onOpenFlow(newFlow.id)
      } catch (error) {
        setCreateError(error instanceof Error ? error.message : 'Failed to create flow')
      }
    }
  }, [newFlowName, newFlowDescription, createFlow, onOpenFlow])

  const handleEditFlow = useCallback(() => {
    if (!editingFlow || !newFlowName.trim()) return
    
    try {
      updateFlow(editingFlow.id, {
        name: newFlowName.trim(),
        description: newFlowDescription.trim() || undefined
      })
      setShowEditModal(false)
      setEditingFlow(null)
      setNewFlowName('')
      setNewFlowDescription('')
      setEditError('')
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Failed to update flow')
    }
  }, [editingFlow, newFlowName, newFlowDescription, updateFlow])

  const handleOpenEditModal = useCallback((flow: Flow) => {
    setEditingFlow(flow)
    setNewFlowName(flow.name)
    setNewFlowDescription(flow.description || '')
    setEditError('')
    setShowEditModal(true)
  }, [])

  const handleDeleteFlow = useCallback((flowId: string, flowName: string) => {
    setDeleteModal({
      isOpen: true,
      flowId,
      flowName
    })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    deleteFlow(deleteModal.flowId)
    setDeleteModal({
      isOpen: false,
      flowId: '',
      flowName: ''
    })
  }, [deleteFlow, deleteModal.flowId])

  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      flowId: '',
      flowName: ''
    })
  }, [])

  // Handle node type deletion
  const handleDeleteNodeType = useCallback((nodeTypeId: string, nodeTypeName: string) => {
    setNodeTypeDeleteModal({
      isOpen: true,
      nodeTypeId,
      nodeTypeName
    })
  }, [])

  const handleNodeTypeDeleteConfirm = useCallback(() => {
    deleteDynamicNodeType(nodeTypeDeleteModal.nodeTypeId)
    setNodeTypeDeleteModal({
      isOpen: false,
      nodeTypeId: '',
      nodeTypeName: ''
    })
  }, [deleteDynamicNodeType, nodeTypeDeleteModal.nodeTypeId])

  const handleNodeTypeDeleteCancel = useCallback(() => {
    setNodeTypeDeleteModal({
      isOpen: false,
      nodeTypeId: '',
      nodeTypeName: ''
    })
  }, [])

  const handleTogglePublish = useCallback((flowId: string, flowName: string, isCurrentlyPublished: boolean) => {
    if (isCurrentlyPublished) {
      // Unpublish without validation
      toggleFlowPublished(flowId, dynamicNodeTypes)
    } else {
      // Validate before publishing
      try {
        const validationResult = toggleFlowPublished(flowId, dynamicNodeTypes)
        
        if (!validationResult.isValid) {
          // Show validation errors
          setValidationModal({
            isOpen: true,
            flowId,
            flowName,
            validationResult
          })
        }
      } catch (error) {
        console.error('Error toggling flow publish status:', error)
      }
    }
  }, [toggleFlowPublished, dynamicNodeTypes])

  const handleValidationModalClose = useCallback(() => {
    setValidationModal({
      isOpen: false,
      flowId: '',
      flowName: '',
      validationResult: null
    })
  }, [])

  const handleValidationModalConfirm = useCallback(() => {
    // This shouldn't be called since we only show the modal for invalid flows
    // But we'll handle it just in case
    if (validationModal.validationResult?.isValid) {
      toggleFlowPublished(validationModal.flowId, dynamicNodeTypes)
    }
    handleValidationModalClose()
  }, [validationModal, toggleFlowPublished, handleValidationModalClose, dynamicNodeTypes])

  // Handle checkbox selection
  const handleFlowSelection = useCallback((flowId: string, checked: boolean) => {
    setSelectedFlows(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(flowId)
      } else {
        newSet.delete(flowId)
      }
      return newSet
    })
  }, [])

  // Handle select all/none
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedFlows(new Set(filteredFlows.map(flow => flow.id)))
    } else {
      setSelectedFlows(new Set())
    }
  }, [filteredFlows])

  // Export selected flows to JSON
  const handleExportFlows = useCallback(() => {
    try {
      // If no flows selected, export all flows
      const flowsToExport = selectedFlows.size > 0 
        ? flows.filter(flow => selectedFlows.has(flow.id))
        : flows

      if (flowsToExport.length === 0) {
        setImportError('No flows selected for export')
        return
      }

      // Get all flow data including nodes and edges
      const exportData = flowsToExport.map(flow => {
        const savedNodes = localStorage.getItem(`onAimFlow-nodes-${flow.id}`)
        const savedEdges = localStorage.getItem(`onAimFlow-edges-${flow.id}`)
        
        return {
          ...flow,
          nodes: savedNodes ? JSON.parse(savedNodes) : [],
          edges: savedEdges ? JSON.parse(savedEdges) : []
        }
      })

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `onAimFlow-flows-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      URL.revokeObjectURL(link.href)
      
      // Clear selection after export
      setSelectedFlows(new Set())
    } catch (error) {
      console.error('Export failed:', error)
      setImportError('Failed to export flows')
    }
  }, [flows, selectedFlows])

  // Import flows from JSON
  const handleImportFlows = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedFlows = JSON.parse(content)

        if (!Array.isArray(importedFlows)) {
          throw new Error('Invalid file format: expected an array of flows')
        }

        // Validate and import each flow
        importedFlows.forEach((flowData: any) => {
          if (!flowData.id || !flowData.name) {
            throw new Error('Invalid flow data: missing required fields')
          }

          // Create the flow
          const newFlow = createFlow(flowData.name, flowData.description)

          // Import nodes and edges if they exist
          if (flowData.nodes && Array.isArray(flowData.nodes)) {
            localStorage.setItem(`onAimFlow-nodes-${newFlow.id}`, JSON.stringify(flowData.nodes))
          }
          if (flowData.edges && Array.isArray(flowData.edges)) {
            localStorage.setItem(`onAimFlow-edges-${newFlow.id}`, JSON.stringify(flowData.edges))
          }

          // Update flow stats
          const nodeCount = flowData.nodes?.length || 0
          const edgeCount = flowData.edges?.length || 0
          updateFlowStats(newFlow.id, nodeCount, edgeCount)
        })

        setImportError('')
        setImportSuccess(`Successfully imported ${importedFlows.length} flow(s)`)
        event.target.value = '' // Reset file input
        
        // Clear success message after 3 seconds
        setTimeout(() => setImportSuccess(''), 3000)
      } catch (error) {
        console.error('Import failed:', error)
        setImportError(error instanceof Error ? error.message : 'Failed to import flows')
        event.target.value = '' // Reset file input
      }
    }
    reader.readAsText(file)
  }, [createFlow, updateFlowStats])

  // Export selected custom node types to JSON
  const handleExportNodeTypes = useCallback(() => {
    try {
      // If no node types selected, export all node types
      const nodeTypesToExport = selectedNodeTypes.size > 0 
        ? Array.from(selectedNodeTypes)
        : undefined

      exportDynamicNodeTypes(nodeTypesToExport)
      
      // Clear selection after export
      setSelectedNodeTypes(new Set())
    } catch (error) {
      setNodeTypeImportError(error instanceof Error ? error.message : 'Failed to export node types')
    }
  }, [selectedNodeTypes, exportDynamicNodeTypes])

  // Import custom node types from JSON
  const handleImportNodeTypes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedNodeTypes = JSON.parse(content)

        if (!Array.isArray(importedNodeTypes)) {
          throw new Error('Invalid file format: expected an array of node types')
        }

        // Validate and import each node type
        importedNodeTypes.forEach((nodeTypeData: any) => {
          if (!nodeTypeData.name || !nodeTypeData.description || !nodeTypeData.icon || !nodeTypeData.color) {
            throw new Error('Invalid node type data: missing required fields')
          }
        })

        // Import all node types
        importDynamicNodeTypes(importedNodeTypes)

        setNodeTypeImportError('')
        setNodeTypeImportSuccess(`Successfully imported ${importedNodeTypes.length} node type(s)`)
        event.target.value = '' // Reset file input
        
        // Clear success message after 3 seconds
        setTimeout(() => setNodeTypeImportSuccess(''), 3000)
      } catch (error) {
        console.error('Import failed:', error)
        setNodeTypeImportError(error instanceof Error ? error.message : 'Failed to import node types')
        event.target.value = '' // Reset file input
      }
    }
    reader.readAsText(file)
  }, [importDynamicNodeTypes])

  // Handle custom node type selection
  const handleNodeTypeSelection = useCallback((nodeTypeId: string, checked: boolean) => {
    setSelectedNodeTypes(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(nodeTypeId)
      } else {
        newSet.delete(nodeTypeId)
      }
      return newSet
    })
  }, [])

  // Handle select all custom node types
  const handleSelectAllNodeTypes = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedNodeTypes(new Set(dynamicNodeTypes.map(nodeType => nodeType.id)))
    } else {
      setSelectedNodeTypes(new Set())
    }
  }, [dynamicNodeTypes])


  return (
    <>
      <Header 
        flowName="Dashboard"
        onCreateFlow={() => setShowCreateModal(true)}
      />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('flows')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'flows'
                  ? isDark 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-blue-600 text-white'
                  : isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Workflows ({flows.length})
            </button>
            <button
              onClick={() => setActiveTab('customNodes')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'customNodes'
                  ? isDark 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-purple-600 text-white'
                  : isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Custom Nodes ({dynamicNodeTypes.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'flows' ? (
            <>
              {/* Flows Tab Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter('all')}
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
                    All Flows ({flows.length})
                  </button>
                  <button
                    onClick={() => setFilter('published')}
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
                    🟢 Published ({flows.filter(f => f.published).length})
                  </button>
                  <button
                    onClick={() => setFilter('draft')}
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
                    ⚪ Drafts ({flows.filter(f => !f.published).length})
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDark 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    + Create Flow
                  </button>
                  <button
                    onClick={handleExportFlows}
                    disabled={flows.length === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      flows.length === 0
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
                      onChange={handleImportFlows}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Selection Summary */}
              {selectedFlows.size > 0 && (
                <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    {selectedFlows.size} flow{selectedFlows.size !== 1 ? 's' : ''} selected for export
                  </p>
                </div>
              )}

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

              {/* Flows Table */}
              <div className={`${isDark ? 'bg-white/8' : 'bg-white/70'} backdrop-blur-md rounded-xl border ${isDark ? 'border-white/20' : 'border-gray-200'} overflow-hidden`}>
                {filteredFlows.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {flows.length === 0 
                        ? 'No workflows yet' 
                        : filter === 'published' 
                          ? 'No published workflows'
                          : filter === 'draft'
                            ? 'No draft workflows'
                            : 'No workflows found'
                      }
                    </h3>
                    <p className={`${isDark ? 'text-white/60' : 'text-gray-600'} mb-6`}>
                      {flows.length === 0 
                        ? 'Create your first workflow to get started'
                        : filter === 'published'
                          ? 'Publish some workflows to see them here'
                          : filter === 'draft'
                            ? 'Create new workflows or unpublish existing ones to see drafts'
                            : 'Try adjusting your filter'
                      }
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        isDark 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Create Your First Flow
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedFlows.size === filteredFlows.length && filteredFlows.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className={`w-4 h-4 rounded border-2 ${
                                  isDark 
                                    ? 'bg-gray-700 border-gray-600 text-blue-500' 
                                    : 'bg-white border-gray-300 text-blue-600'
                                } focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                              />
                            </div>
                          </th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Name
                          </th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Description
                          </th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Status
                          </th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Nodes
                          </th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Connections
                          </th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFlows.map((flow) => (
                          <tr 
                            key={flow.id} 
                            className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'} hover:${isDark ? 'bg-white/5' : 'bg-gray-50/50'} transition-colors`}
                          >
                            <td className="p-4">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedFlows.has(flow.id)}
                                  onChange={(e) => {
                                    e.stopPropagation()
                                    handleFlowSelection(flow.id, e.target.checked)
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`w-4 h-4 rounded border-2 ${
                                    isDark 
                                      ? 'bg-gray-700 border-gray-600 text-blue-500' 
                                      : 'bg-white border-gray-300 text-blue-600'
                                  } focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                                />
                              </div>
                            </td>
                            <td 
                              className={`p-4 ${isDark ? 'text-white' : 'text-gray-900'} cursor-pointer`}
                              onClick={() => onOpenFlow(flow.id)}
                            >
                              <div className="font-semibold">{flow.name}</div>
                            </td>
                            <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                              {flow.description || 'No description'}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  flow.published
                                    ? isDark 
                                      ? 'bg-green-500/20 text-green-300' 
                                      : 'bg-green-100 text-green-800'
                                    : isDark
                                      ? 'bg-gray-500/20 text-gray-300'
                                      : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {flow.published ? '🟢 Published' : '⚪ Draft'}
                                </span>
                              </div>
                            </td>
                            <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                              {flow.nodeCount}
                            </td>
                            <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                              {flow.edgeCount}
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onOpenFlow(flow.id)
                                  }}
                                  className={`px-3 py-1 text-sm rounded transition-colors ${
                                    isDark 
                                      ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  }`}
                                >
                                  Open
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenEditModal(flow)
                                  }}
                                  className={`px-3 py-1 text-sm rounded transition-colors ${
                                    isDark 
                                      ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30' 
                                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                  }`}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleTogglePublish(flow.id, flow.name, flow.published)
                                  }}
                                  className={`px-3 py-1 text-sm rounded transition-colors ${
                                    flow.published
                                      ? isDark 
                                        ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' 
                                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                      : isDark
                                        ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                >
                                  {flow.published ? 'Unpublish' : 'Publish'}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteFlow(flow.id, flow.name)
                                  }}
                                  className={`px-3 py-1 text-sm rounded transition-colors ${
                                    isDark 
                                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                                  }`}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Custom Nodes Tab Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Custom Node Types ({dynamicNodeTypes.length})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingNodeType(undefined)
                      setShowNodeEditor(true)
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDark 
                        ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    + Create Node Type
                  </button>
                  <button
                    onClick={handleExportNodeTypes}
                    disabled={dynamicNodeTypes.length === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      dynamicNodeTypes.length === 0
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
                      onChange={handleImportNodeTypes}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Selection Summary */}
              {selectedNodeTypes.size > 0 && (
                <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    {selectedNodeTypes.size} node type{selectedNodeTypes.size !== 1 ? 's' : ''} selected for export
                  </p>
                </div>
              )}

              {/* Import Error/Success Display */}
              {nodeTypeImportError && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{nodeTypeImportError}</p>
                </div>
              )}
              {nodeTypeImportSuccess && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                  <p className="text-green-700 dark:text-green-300 text-sm">{nodeTypeImportSuccess}</p>
                </div>
              )}

              {/* Custom Nodes Table */}
              <div className={`${isDark ? 'bg-white/8' : 'bg-white/70'} backdrop-blur-md rounded-xl border ${isDark ? 'border-white/20' : 'border-gray-200'} overflow-hidden`}>
                {dynamicNodeTypes.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      No Custom Node Types Yet
                    </h3>
                    <p className={`${isDark ? 'text-white/60' : 'text-gray-600'} mb-6`}>
                      Create your first custom node type to extend your workflow capabilities.
                    </p>
                    <button
                      onClick={() => {
                        setEditingNodeType(undefined)
                        setShowNodeEditor(true)
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        isDark 
                          ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      Create Your First Node Type
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedNodeTypes.size === dynamicNodeTypes.length && dynamicNodeTypes.length > 0}
                                onChange={(e) => handleSelectAllNodeTypes(e.target.checked)}
                                className={`w-4 h-4 rounded border-2 ${
                                  isDark 
                                    ? 'bg-gray-700 border-gray-600 text-blue-500' 
                                    : 'bg-white border-gray-300 text-blue-600'
                                } focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                              />
                            </div>
                          </th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Node Type
                          </th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Category
                          </th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Connection Points
                          </th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Configuration Fields
                          </th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dynamicNodeTypes.map((nodeType) => (
                          <tr 
                            key={nodeType.id} 
                            className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'} hover:${isDark ? 'bg-white/5' : 'bg-gray-50/50'} transition-colors`}
                          >
                            <td className="p-4">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedNodeTypes.has(nodeType.id)}
                                  onChange={(e) => {
                                    e.stopPropagation()
                                    handleNodeTypeSelection(nodeType.id, e.target.checked)
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`w-4 h-4 rounded border-2 ${
                                    isDark 
                                      ? 'bg-gray-700 border-gray-600 text-blue-500' 
                                      : 'bg-white border-gray-300 text-blue-600'
                                  } focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                                />
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 bg-gradient-to-r ${nodeType.color} rounded-lg flex items-center justify-center`}>
                                  <span className="text-white text-sm">{nodeType.icon}</span>
                                </div>
                                <div>
                                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {nodeType.name}
                                  </div>
                                  <div className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                                    {nodeType.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                isDark 
                                  ? 'bg-blue-500/20 text-blue-300' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {nodeType.category}
                              </span>
                            </td>
                            <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                              <div className="flex flex-wrap gap-1">
                                {nodeType.ports.map((port) => (
                                  <span 
                                    key={port.id}
                                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                                      port.type === 'input'
                                        ? isDark 
                                          ? 'bg-blue-500/20 text-blue-300' 
                                          : 'bg-blue-100 text-blue-800'
                                        : port.type === 'output'
                                        ? isDark 
                                          ? 'bg-green-500/20 text-green-300' 
                                          : 'bg-green-100 text-green-800'
                                        : isDark 
                                          ? 'bg-purple-500/20 text-purple-300' 
                                          : 'bg-purple-100 text-purple-800'
                                    }`}
                                  >
                                    {port.name} ({port.type})
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                              <div className="flex flex-wrap gap-1">
                                {nodeType.fields.map((field) => (
                                  <span 
                                    key={field.id}
                                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                                      isDark 
                                        ? 'bg-gray-500/20 text-gray-300' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {field.name} ({field.type})
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingNodeType(nodeType)
                                    setShowNodeEditor(true)
                                  }}
                                  className={`px-3 py-1 text-sm rounded transition-colors ${
                                    isDark 
                                      ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  }`}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteNodeType(nodeType.id, nodeType.name)}
                                  className={`px-3 py-1 text-sm rounded transition-colors ${
                                    isDark 
                                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                                  }`}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>



      {/* Create Flow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md mx-4`}>
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create New Flow
            </h2>
            
            <div className="space-y-4">
              {createError && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{createError}</p>
                </div>
              )}
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Flow Name *
                </label>
                <input
                  type="text"
                  value={newFlowName}
                  onChange={(e) => {
                    setNewFlowName(e.target.value)
                    setCreateError('') // Clear error when user types
                  }}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter flow name"
                  autoFocus
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={newFlowDescription}
                  onChange={(e) => setNewFlowDescription(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter flow description (optional)"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewFlowName('')
                  setNewFlowDescription('')
                  setCreateError('')
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFlow}
                disabled={!newFlowName.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  newFlowName.trim()
                    ? isDark 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isDark
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Flow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Flow Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md mx-4`}>
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edit Flow
            </h2>
            
            <div className="space-y-4">
              {editError && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{editError}</p>
                </div>
              )}
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Flow Name *
                </label>
                <input
                  type="text"
                  value={newFlowName}
                  onChange={(e) => {
                    setNewFlowName(e.target.value)
                    setEditError('') // Clear error when user types
                  }}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter flow name"
                  autoFocus
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={newFlowDescription}
                  onChange={(e) => setNewFlowDescription(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter flow description (optional)"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingFlow(null)
                  setNewFlowName('')
                  setNewFlowDescription('')
                  setEditError('')
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleEditFlow}
                disabled={!newFlowName.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  newFlowName.trim()
                    ? isDark 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isDark
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Update Flow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Modal */}
      {validationModal.validationResult && (
        <ValidationModal
          isOpen={validationModal.isOpen}
          onClose={handleValidationModalClose}
          onConfirm={handleValidationModalConfirm}
          validationResult={validationModal.validationResult}
          flowName={validationModal.flowName}
          action="publish"
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Flow"
        message="Are you sure you want to delete this workflow?"
        itemName={deleteModal.flowName}
        itemType="Flow"
      />

      {/* Node Type Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={nodeTypeDeleteModal.isOpen}
        onClose={handleNodeTypeDeleteCancel}
        onConfirm={handleNodeTypeDeleteConfirm}
        title="Delete Node Type"
        message="Are you sure you want to delete this custom node type? This action cannot be undone."
        itemName={nodeTypeDeleteModal.nodeTypeName}
        itemType="Node Type"
      />

      {/* Dynamic Node Editor Modal */}
      <DynamicNodeEditorModal
        isOpen={showNodeEditor}
        onClose={() => setShowNodeEditor(false)}
        nodeType={editingNodeType}
      />
    </div>
    </>
  )
} 