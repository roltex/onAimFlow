import React, { useCallback } from 'react'
import { NodePalette } from './NodePalette'
import { FlowCanvas } from './FlowCanvas'
import type { NodeType } from '../types'
import type { Node, Edge } from '@xyflow/react'

interface CanvasContainerProps {
  flowId?: string
  onNodesChange?: (nodes: Node[]) => void
  onEdgesChange?: (edges: Edge[]) => void
  isFlowPublished?: boolean
  // Composite editor props
  isCompositeEditor?: boolean
  compositeNode?: any
  onCompositeChange?: (nodes: any[], edges: any[]) => void
  onSave?: (updatedComposite: any) => void
}

/**
 * Container component that combines the node palette and flow canvas
 */
export const CanvasContainer: React.FC<CanvasContainerProps> = ({ 
  flowId, 
  onNodesChange, 
  onEdgesChange,
  isFlowPublished = false,
  isCompositeEditor = false,
  compositeNode,
  onCompositeChange,
  onSave
}) => {
  const handleDragStart = useCallback((event: React.DragEvent, nodeType: NodeType) => {
    // Don't allow dragging when flow is published
    if (isFlowPublished) {
      event.preventDefault()
      return
    }
    
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeType))
    event.dataTransfer.effectAllowed = 'move'
  }, [isFlowPublished])

  return (
    <main className="flex h-full">
      <NodePalette onDragStart={handleDragStart} disabled={isFlowPublished} />
      <FlowCanvas 
        flowId={flowId}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        isCompositeEditor={isCompositeEditor}
        compositeNode={compositeNode}
        onCompositeChange={onCompositeChange}
        onSave={onSave}
        isFlowPublished={isFlowPublished}
      />
    </main>
  )
} 