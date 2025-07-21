import React, { useState, useCallback } from 'react'
import { useFlowManager } from '../contexts/FlowManagerContext'
import { useDynamicNodes } from '../contexts/DynamicNodeContext'
import { useCompositeNodes } from '../contexts/CompositeNodeContext'
import { Header } from './Header'
import { ValidationModal } from './modals/ValidationModal'
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal'
import { DynamicNodeEditorModal } from './modals/DynamicNodeEditorModal'
import { TabNavigation } from './dashboard/TabNavigation'
import { CreateFlowModal } from './dashboard/CreateFlowModal'
import { EditFlowModal } from './dashboard/EditFlowModal'
import { FlowsTab } from './dashboard/FlowsTab'
import { CustomNodesTab } from './dashboard/CustomNodesTab'
import { CompositeNodesTab } from './dashboard/CompositeNodesTab'
import type { Flow, FlowValidationResult, DynamicNodeType } from '../types'

interface DashboardProps {
  onOpenFlow: (flowId: string) => void
  onOpenCompositeEditor: (compositeId?: string) => void
}

/**
 * Dashboard component with flows management
 */
export const Dashboard: React.FC<DashboardProps> = ({ onOpenFlow, onOpenCompositeEditor }) => {
  const { flows, createFlow, deleteFlow, toggleFlowPublished, updateFlowStats, updateFlow } = useFlowManager()
  const { dynamicNodeTypes, deleteDynamicNodeType, importDynamicNodeTypes, exportDynamicNodeTypes } = useDynamicNodes()
  const { compositeNodes } = useCompositeNodes()
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showNodeEditor, setShowNodeEditor] = useState(false)
  
  // Form states
  const [editingFlow, setEditingFlow] = useState<Flow | null>(null)
  const [newFlowName, setNewFlowName] = useState('')
  const [newFlowDescription, setNewFlowDescription] = useState('')
  const [editingNodeType, setEditingNodeType] = useState<DynamicNodeType | undefined>(undefined)
  
  // Error states
  const [createError, setCreateError] = useState<string>('')
  const [editError, setEditError] = useState<string>('')
  const [importError, setImportError] = useState<string>('')
  const [importSuccess, setImportSuccess] = useState<string>('')
  const [nodeTypeImportError, setNodeTypeImportError] = useState<string>('')
  const [nodeTypeImportSuccess, setNodeTypeImportSuccess] = useState<string>('')
  
  // Selection states
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [selectedNodeTypes, setSelectedNodeTypes] = useState<Set<string>>(new Set())
  const [selectedFlows, setSelectedFlows] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'flows' | 'customNodes' | 'compositeNodes'>('flows')

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

  // Flow management handlers
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

  // Flow selection handlers
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

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedFlows(new Set(filteredFlows.map(flow => flow.id)))
    } else {
      setSelectedFlows(new Set())
    }
  }, [filteredFlows])

  // Flow import/export handlers
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
      
      setImportError('Failed to export flows')
    }
  }, [flows, selectedFlows])

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
        setImportError(error instanceof Error ? error.message : 'Failed to import flows')
        event.target.value = '' // Reset file input
      }
    }
    reader.readAsText(file)
  }, [createFlow, updateFlowStats])

  // Node type management handlers
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
        setNodeTypeImportError(error instanceof Error ? error.message : 'Failed to import node types')
        event.target.value = '' // Reset file input
      }
    }
    reader.readAsText(file)
  }, [importDynamicNodeTypes])

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

  const handleSelectAllNodeTypes = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedNodeTypes(new Set(dynamicNodeTypes.map(nodeType => nodeType.id)))
    } else {
      setSelectedNodeTypes(new Set())
    }
  }, [dynamicNodeTypes])

  const handleEditNodeType = useCallback((nodeType: DynamicNodeType) => {
    setEditingNodeType(nodeType)
    setShowNodeEditor(true)
  }, [])

  const handleCreateNodeType = useCallback(() => {
    setEditingNodeType(undefined)
    setShowNodeEditor(true)
  }, [])

  return (
    <>
      <Header 
        flowName="Dashboard"
      />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            flowsCount={flows.length}
            customNodesCount={dynamicNodeTypes.length}
            compositeNodesCount={compositeNodes.length}
          />

          {/* Tab Content */}
          {activeTab === 'flows' ? (
            <FlowsTab
              flows={flows}
              filteredFlows={filteredFlows}
              filter={filter}
              onFilterChange={setFilter}
              selectedFlows={selectedFlows}
              onFlowSelection={handleFlowSelection}
              onSelectAll={handleSelectAll}
              onOpenFlow={onOpenFlow}
              onEditFlow={handleOpenEditModal}
              onTogglePublish={handleTogglePublish}
              onDeleteFlow={handleDeleteFlow}
              onCreateFlow={() => setShowCreateModal(true)}
              onExportFlows={handleExportFlows}
              onImportFlows={handleImportFlows}
              importError={importError}
              importSuccess={importSuccess}
            />
          ) : activeTab === 'customNodes' ? (
            <CustomNodesTab
              dynamicNodeTypes={dynamicNodeTypes}
              selectedNodeTypes={selectedNodeTypes}
              onNodeTypeSelection={handleNodeTypeSelection}
              onSelectAllNodeTypes={handleSelectAllNodeTypes}
              onEditNodeType={handleEditNodeType}
              onDeleteNodeType={handleDeleteNodeType}
              onCreateNodeType={handleCreateNodeType}
              onExportNodeTypes={handleExportNodeTypes}
              onImportNodeTypes={handleImportNodeTypes}
              importError={nodeTypeImportError}
              importSuccess={nodeTypeImportSuccess}
            />
          ) : (
            <CompositeNodesTab
              onEditComposite={onOpenCompositeEditor}
            />
          )}
                </div>
              </div>

      {/* Create Flow Modal */}
      <CreateFlowModal
        isOpen={showCreateModal}
        onClose={() => {
                  setShowCreateModal(false)
                  setNewFlowName('')
                  setNewFlowDescription('')
                  setCreateError('')
                }}
        onSubmit={handleCreateFlow}
        flowName={newFlowName}
        flowDescription={newFlowDescription}
        onFlowNameChange={(name: string) => {
          setNewFlowName(name)
          setCreateError('')
        }}
        onFlowDescriptionChange={setNewFlowDescription}
        error={createError}
      />

      {/* Edit Flow Modal */}
      <EditFlowModal
        isOpen={showEditModal}
        onClose={() => {
                  setShowEditModal(false)
                  setEditingFlow(null)
                  setNewFlowName('')
                  setNewFlowDescription('')
                  setEditError('')
                }}
        onSubmit={handleEditFlow}
        flowName={newFlowName}
        flowDescription={newFlowDescription}
        onFlowNameChange={(name: string) => {
          setNewFlowName(name)
          setEditError('')
        }}
        onFlowDescriptionChange={setNewFlowDescription}
        error={editError}
      />

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
    </>
  )
} 