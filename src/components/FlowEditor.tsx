import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Header } from './Header'
import { CanvasContainer } from './CanvasContainer'
import { ValidationModal } from './modals/ValidationModal'
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal'
import { useFlowManager } from '../contexts/FlowManagerContext'
import { useDynamicNodes } from '../contexts/DynamicNodeContext'
import type { Node, Edge } from '@xyflow/react'
import type { FlowValidationResult } from '../types'

interface FlowEditorProps {
  flowId: string
  onBackToDashboard: () => void
}

/**
 * Flow editor component for editing specific flows
 */
export const FlowEditor: React.FC<FlowEditorProps> = ({ flowId, onBackToDashboard }) => {
  const { getFlow, updateFlowStats, deleteFlow, toggleFlowPublished } = useFlowManager()
  const { dynamicNodeTypes } = useDynamicNodes()
  
  // Memoize the flow lookup to prevent unnecessary re-renders
  const flow = useMemo(() => getFlow(flowId), [getFlow, flowId])
  
  // Use refs to track the latest counts without causing re-renders
  const nodeCountRef = useRef<number>(0)
  const edgeCountRef = useRef<number>(0)
  const updateTimeoutRef = useRef<number | null>(null)

  // Validation modal state
  const [validationModal, setValidationModal] = useState<{
    isOpen: boolean
    validationResult: FlowValidationResult | null
  }>({
    isOpen: false,
    validationResult: null
  })

  // Delete confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Debounced stats update to prevent infinite loops
  const debouncedUpdateStats = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = window.setTimeout(() => {
      updateFlowStats(flowId, nodeCountRef.current, edgeCountRef.current)
    }, 300) // 300ms debounce
  }, [flowId, updateFlowStats])

  // Handle nodes/edges changes to update flow stats
  const handleNodesChange = useCallback((nodes: Node[]) => {
    nodeCountRef.current = nodes.length
    debouncedUpdateStats()
  }, [debouncedUpdateStats])

  const handleEdgesChange = useCallback((edges: Edge[]) => {
    edgeCountRef.current = edges.length
    debouncedUpdateStats()
  }, [debouncedUpdateStats])

  // Clear flow and redirect to dashboard
  const handleClearFlow = useCallback(() => {
    setShowDeleteConfirm(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    deleteFlow(flowId)
    setShowDeleteConfirm(false)
    onBackToDashboard()
  }, [flowId, deleteFlow, onBackToDashboard])

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false)
  }, [])

  // Toggle publish status
  const handleTogglePublish = useCallback(() => {
    if (!flow) return
    
    if (flow.published) {
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
            validationResult
          })
        }
      } catch (error) {
        console.error('Error toggling flow publish status:', error)
      }
    }
  }, [flow, flowId, toggleFlowPublished, dynamicNodeTypes])

  const handleValidationModalClose = useCallback(() => {
    setValidationModal({
      isOpen: false,
      validationResult: null
    })
  }, [])

  const handleValidationModalConfirm = useCallback(() => {
    // This shouldn't be called since we only show the modal for invalid flows
    // But we'll handle it just in case
    if (validationModal.validationResult?.isValid) {
      toggleFlowPublished(flowId, dynamicNodeTypes)
    }
    handleValidationModalClose()
  }, [validationModal, flowId, toggleFlowPublished, handleValidationModalClose, dynamicNodeTypes])

  // Redirect to dashboard if flow doesn't exist
  useEffect(() => {
    if (!flow) {
      onBackToDashboard()
    }
  }, [flow, onBackToDashboard])

  // Initialize counts from localStorage on mount
  useEffect(() => {
    const savedNodes = localStorage.getItem(`onAimFlow-nodes-${flowId}`)
    const savedEdges = localStorage.getItem(`onAimFlow-edges-${flowId}`)
    
    if (savedNodes) {
      try {
        nodeCountRef.current = JSON.parse(savedNodes).length
      } catch (e) {
        nodeCountRef.current = 0
      }
    }
    
    if (savedEdges) {
      try {
        edgeCountRef.current = JSON.parse(savedEdges).length
      } catch (e) {
        edgeCountRef.current = 0
      }
    }
  }, [flowId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  if (!flow) {
    return null
  }

  return (
    <>
      <Header 
        flowName={flow.name}
        onBackToDashboard={onBackToDashboard}
        onClearFlow={handleClearFlow}
        onTogglePublish={handleTogglePublish}
        isPublished={flow.published}
      />
      <CanvasContainer 
        flowId={flowId}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        isFlowPublished={flow.published}
      />
      
              {/* Validation Modal */}
        {validationModal.validationResult && (
          <ValidationModal
            isOpen={validationModal.isOpen}
            onClose={handleValidationModalClose}
            onConfirm={handleValidationModalConfirm}
            validationResult={validationModal.validationResult}
            flowName={flow.name}
            action="publish"
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={showDeleteConfirm}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Flow"
          message="Are you sure you want to delete this entire workflow?"
          itemName={flow.name}
          itemType="Flow"
        />
      </>
    )
} 