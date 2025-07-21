import React, { useState, useCallback, useRef } from 'react'
import { useCompositeNodes } from '../contexts/CompositeNodeContext'
import { CompositeHeader } from './CompositeHeader'
import { CanvasContainer } from './CanvasContainer'
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal'
import { useSearchParams, useNavigate } from 'react-router-dom'
import type { CompositeNode } from '../types'
import { validateCompositeForPublish } from '../utils/compositeValidation'
import { ValidationModal } from './modals/ValidationModal'

interface CompositeNodeEditorProps {
  compositeId?: string
  onBack: () => void
}

export const CompositeNodeEditor: React.FC<CompositeNodeEditorProps> = ({
  compositeId,
  onBack
}) => {
  const { getCompositeNode, createCompositeNode, updateCompositeNode, deleteCompositeNode, toggleCompositePublished } = useCompositeNodes()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // State for the composite being edited
  const [currentComposite, setCurrentComposite] = useState<CompositeNode | null>(null)
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const hasCreatedRef = useRef(false)

  // Validation modal state
  const [validationModal, setValidationModal] = useState<{
    isOpen: boolean
    validationResult: ReturnType<typeof validateCompositeForPublish> | null
    compositeName: string
  }>({
    isOpen: false,
    validationResult: null,
    compositeName: ''
  })

  // Load existing composite on mount
  React.useEffect(() => {
    if (compositeId && !compositeId.startsWith('new') && !currentComposite) {
      const composite = getCompositeNode(compositeId)
      if (composite) {
    
        setCurrentComposite(composite)
      }
    }
  }, [compositeId, currentComposite, getCompositeNode])

  // Handle new composite creation on mount
  React.useEffect(() => {
    if (compositeId?.startsWith('new') && !currentComposite && !hasCreatedRef.current) {
      hasCreatedRef.current = true
      
      const name = searchParams.get('name') || 'New Composite'
      const description = searchParams.get('description') || ''
      const connectionType = searchParams.get('connectionType') || 'input/output'
      const icon = searchParams.get('icon') || '🔗'
      const category = searchParams.get('category') || 'composite'
      const color = searchParams.get('color') || 'from-purple-500 to-purple-600'
      
      const compositeData = {
        name: name,
        description: description,
        icon: icon,
        color: color,
        category: category,
        connectionType: connectionType as 'input' | 'output' | 'input/output',
        internalNodes: [],
        internalEdges: [],
        exposedInputs: connectionType === 'input' || connectionType === 'input/output' ? [
          {
            id: 'default-input',
            name: 'Input',
            type: 'input' as const,
            description: 'Default input port',
            internalNodeId: 'composite-root',
            internalPortId: 'input-1'
          }
        ] : [],
        exposedOutputs: connectionType === 'output' || connectionType === 'input/output' ? [
          {
            id: 'default-output',
            name: 'Output',
            type: 'output' as const,
            description: 'Default output port',
            internalNodeId: 'composite-root',
            internalPortId: 'output-1'
          }
        ] : [],
        published: false
      }
      
  
      
      // Add the new composite to the context
      const createdComposite = createCompositeNode(compositeData)
      setCurrentComposite(createdComposite)
      
      // Navigate to the actual composite ID to replace the "new" URL
      navigate(`/composite/${createdComposite.id}`, { replace: true })
    }
  }, [compositeId, searchParams, createCompositeNode, navigate, currentComposite]) // Added currentComposite to dependencies
  




  // Handle delete composite
  const handleDeleteComposite = useCallback(() => {
    setShowDeleteModal(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (currentComposite) {
      deleteCompositeNode(currentComposite.id)
      onBack()
    }
  }, [currentComposite, deleteCompositeNode, onBack])

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false)
  }, [])

  // Handle canvas changes
  const handleCanvasChange = useCallback((nodes: any[], edges: any[]) => {
    if (currentComposite) {
      const updatedComposite = {
        ...currentComposite,
        internalNodes: nodes,
        internalEdges: edges
      }
      setCurrentComposite(updatedComposite)
      // Save changes to localStorage
      updateCompositeNode(currentComposite.id, updatedComposite)
    }
  }, [currentComposite, updateCompositeNode])

  // Handle publish/unpublish with validation
  const handleTogglePublish = useCallback(() => {
    if (!currentComposite) return
    if (currentComposite.published) {
      // Unpublish without validation
      toggleCompositePublished(currentComposite.id)
      setCurrentComposite(prev => prev ? { ...prev, published: false } : null)
    } else {
      // Validate before publishing
      const validationResult = validateCompositeForPublish(currentComposite)
      if (!validationResult.isValid) {
        setValidationModal({
          isOpen: true,
          validationResult,
          compositeName: currentComposite.name
        })
        return
      }
      toggleCompositePublished(currentComposite.id)
      setCurrentComposite(prev => prev ? { ...prev, published: true } : null)
    }
  }, [currentComposite, toggleCompositePublished])

  const handleValidationModalClose = useCallback(() => {
    setValidationModal({
      isOpen: false,
      validationResult: null,
      compositeName: ''
    })
  }, [])

  return (
    <>
      <CompositeHeader
        compositeName={currentComposite?.name}
        onBackToDashboard={onBack}
        onClearComposite={currentComposite ? handleDeleteComposite : undefined}
        onTogglePublish={currentComposite ? handleTogglePublish : undefined}
        isPublished={currentComposite?.published}
      />
      {currentComposite ? (
        <CanvasContainer
          flowId={`composite-${currentComposite.id}`}
          isCompositeEditor={true}
          compositeNode={currentComposite}
          onCompositeChange={handleCanvasChange}
          isFlowPublished={currentComposite.published}
        />
      ) : null}
      {/* Validation Modal */}
      {validationModal.validationResult && (
        <ValidationModal
          isOpen={validationModal.isOpen}
          onClose={handleValidationModalClose}
          validationResult={validationModal.validationResult}
          flowName={validationModal.compositeName}
          action="publish"
          itemType="composite"
        />
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Composite Node"
        message="Are you sure you want to delete this composite node? This action cannot be undone."
        itemName={currentComposite?.name || ''}
        itemType="Composite Node"
      />
    </>
  )
} 