import React, { useCallback, useRef, useEffect, useState } from 'react'
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  type Node as ReactFlowNode,
  type Edge as ReactFlowEdge,
  type Connection,
} from '@xyflow/react'
import type { Node, Edge } from '../types'
import '@xyflow/react/dist/style.css'
import { useTheme } from './ThemeProvider'
import { useFlowManager } from '../contexts/FlowManagerContext'
import { useDynamicNodes } from '../contexts/DynamicNodeContext'
import { useCompositeNodes } from '../contexts/CompositeNodeContext'
import { CustomNode } from './CustomNode'
import { NodeConfigModal } from './modals/NodeConfigModal'
import { EdgeDropModal } from './modals/EdgeDropModal'

import { useEdgeDrop } from '../hooks/useEdgeDrop'
import type { NodeType, CustomNodeData, DynamicNodeType } from '../types'

interface FlowCanvasProps {
  flowId?: string
  onNodesChange?: (nodes: Node[]) => void
  onEdgesChange?: (edges: Edge[]) => void
  // Composite editor props
  isCompositeEditor?: boolean
  compositeNode?: any
  onCompositeChange?: (nodes: any[], edges: any[]) => void
  onSave?: (updatedComposite: any) => void
  isFlowPublished?: boolean
}

// Create a wrapper component that handles clicks more reliably
const ClickableCustomNode = (props: any) => {
  const handleClick = useCallback(() => {
    // Use a more direct approach - find the FlowCanvas instance and call its click handler
    const event = new CustomEvent('nodeClick', { detail: { nodeId: props.id } })
    window.dispatchEvent(event)
  }, [props.id])

  return (
    <CustomNode 
      {...props} 
      onClick={handleClick}
    />
  )
}

// Static node types mapping - defined outside component to prevent recreation
const nodeTypes = {
  custom: ClickableCustomNode,
}

/**
 * Inner component that uses React Flow hooks
 */
const FlowCanvasInner: React.FC<FlowCanvasProps> = ({
  flowId,
  onNodesChange,
  onEdgesChange,
  isCompositeEditor = false,
  compositeNode,
  onCompositeChange,
  isFlowPublished: propIsFlowPublished
}) => {
  const { isDark } = useTheme()
  const { getFlow } = useFlowManager()
  const { dynamicNodeTypes } = useDynamicNodes()
  const { getCompositeNode } = useCompositeNodes()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useReactFlow()
  
  // Check if current flow is published
  const currentFlow = flowId ? getFlow(flowId) : null
  const isFlowPublished = propIsFlowPublished !== undefined ? propIsFlowPublished : (currentFlow?.published || false)
  
  // Generate localStorage keys based on flowId
  const getStorageKey = (type: 'nodes' | 'edges') => {
    return flowId ? `onAimFlow-${type}-${flowId}` : `onAimFlow-${type}`
  }
  
  // Initialize state from localStorage or composite
  const getInitialNodes = (): ReactFlowNode[] => {
    if (isCompositeEditor && compositeNode) {
      // For composite editor, use the composite's internal nodes
      return compositeNode.internalNodes || []
    } else {
      // For regular flows, use localStorage
      const saved = localStorage.getItem(getStorageKey('nodes'))
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
  
        }
      }
      return []
    }
  }
  
  const getInitialEdges = (): ReactFlowEdge[] => {
    if (isCompositeEditor && compositeNode) {
      // For composite editor, use the composite's internal edges
      return compositeNode.internalEdges || []
    } else {
      // For regular flows, use localStorage
      const saved = localStorage.getItem(getStorageKey('edges'))
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
  
        }
      }
      return []
    }
  }
  
  // Initialize state
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState<ReactFlowNode>(getInitialNodes())
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState<ReactFlowEdge>(getInitialEdges())
  
  // Modal state
  const [selectedNode, setSelectedNode] = useState<ReactFlowNode | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Track selected nodes/edges from React Flow
  const [selectedNodes, setSelectedNodes] = useState<ReactFlowNode[]>([])
  const [selectedEdges, setSelectedEdges] = useState<ReactFlowEdge[]>([])

  // Debounced update refs for composite changes
  const compositeUpdateTimeoutRef = useRef<number | null>(null)

  // Helper functions to convert between React Flow types and our types
  const convertToOurNode = (rfNode: ReactFlowNode): Node => ({
    id: rfNode.id,
    type: rfNode.type || 'custom',
    position: rfNode.position,
    data: rfNode.data as CustomNodeData
  })

  const convertToOurEdge = (rfEdge: ReactFlowEdge): Edge => ({
    id: rfEdge.id,
    source: rfEdge.source,
    target: rfEdge.target,
    sourceHandle: rfEdge.sourceHandle || undefined,
    targetHandle: rfEdge.targetHandle || undefined,
    type: rfEdge.type,
    style: rfEdge.style || {
      stroke: isDark ? '#60a5fa' : '#3b82f6',
      strokeWidth: 3,
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
    },
    animated: rfEdge.animated !== undefined ? rfEdge.animated : true
  })

  const convertToOurNodes = (rfNodes: ReactFlowNode[]): Node[] => 
    rfNodes.map(convertToOurNode)

  const convertToOurEdges = (rfEdges: ReactFlowEdge[]): Edge[] => 
    rfEdges.map(convertToOurEdge)

  // Debounced composite update function
  const debouncedCompositeUpdate = useCallback(() => {
    if (compositeUpdateTimeoutRef.current) {
      clearTimeout(compositeUpdateTimeoutRef.current)
    }
    
    compositeUpdateTimeoutRef.current = window.setTimeout(() => {
      if (isCompositeEditor && onCompositeChange) {
        onCompositeChange(convertToOurNodes(nodes), convertToOurEdges(edges))
      }
    }, 300) // 300ms debounce
  }, [nodes, edges, isCompositeEditor, onCompositeChange])

  // Composite creation modal state


  // Optimized edge drop functionality
  const {
    edgeDropState,
    handleConnectEnd,
    handleEdgeDoubleClick,
    handleNodeTypeSelect,
    closeModal
  } = useEdgeDrop(nodes, edges, setNodes, setEdges, isDark)

  // Handle node click - simple and reliable
  const handleNodeClick = useCallback((nodeId: string) => {
    // Don't allow node configuration when flow is published
    if (isFlowPublished) return
    
    const node = nodes.find(n => n.id === nodeId)
    if (node) {
      setSelectedNode(node)
      setIsModalOpen(true)
    }
  }, [nodes, isFlowPublished])

  // Listen for node click events from the wrapper component
  useEffect(() => {
    const handleNodeClickEvent = (event: any) => {
      const { nodeId } = event.detail
      handleNodeClick(nodeId)
    }

    window.addEventListener('nodeClick', handleNodeClickEvent)
    return () => {
      window.removeEventListener('nodeClick', handleNodeClickEvent)
    }
  }, [handleNodeClick])

  // Handle selection changes
  const onSelectionChange = useCallback(({ nodes, edges }: { nodes: ReactFlowNode[], edges: ReactFlowEdge[] }) => {
    setSelectedNodes(nodes)
    setSelectedEdges(edges)
  }, [])



  // Handle node connections
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: ReactFlowEdge = {
        id: `edge-${Date.now()}`,
        source: params.source!,
        target: params.target!,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: isDark ? '#60a5fa' : '#3b82f6',
          strokeWidth: 3,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges, isDark]
  )

  // Handle modal save
  const handleModalSave = useCallback((updatedData: CustomNodeData) => {
    if (selectedNode) {
      setNodes(nds => nds.map(node => 
        node.id === selectedNode.id 
          ? { ...node, data: updatedData as unknown as Record<string, unknown> }
          : node
      ))
    }
  }, [selectedNode, setNodes])

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setSelectedNode(null)
  }, [])

  // Handle node delete
  const handleNodeDelete = useCallback(() => {
    if (selectedNode) {
      // Remove the node
      setNodes(nds => nds.filter(node => node.id !== selectedNode.id))
      
      // Remove all edges connected to this node
      setEdges(eds => eds.filter(edge => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ))
      
      // Close the modal
      handleModalClose()
    }
  }, [selectedNode, setNodes, setEdges, handleModalClose])

  // Handle keyboard delete
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't allow deletion when flow is published
    if (isFlowPublished) return
    
    if (event.key === 'Delete' || event.key === 'Backspace') {
      // Prevent default browser behavior
      event.preventDefault()
      
      // Delete selected nodes
      if (selectedNodes.length > 0) {
        const nodeIdsToDelete = selectedNodes.map(node => node.id)
        
        // Remove selected nodes
        setNodes(nds => nds.filter(node => !nodeIdsToDelete.includes(node.id)))
        
        // Remove edges connected to deleted nodes
        setEdges(eds => eds.filter(edge => 
          !nodeIdsToDelete.includes(edge.source) && !nodeIdsToDelete.includes(edge.target)
        ))
      }
      
      // Delete selected edges
      if (selectedEdges.length > 0) {
        const edgeIdsToDelete = selectedEdges.map(edge => edge.id)
        setEdges(eds => eds.filter(edge => !edgeIdsToDelete.includes(edge.id)))
      }
    }
  }, [selectedNodes, selectedEdges, setNodes, setEdges, isFlowPublished])

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])


  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    // Don't allow dropping when flow is published
    if (isFlowPublished) return
    
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [isFlowPublished])

  // Handle node drop on canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      // Don't allow dropping when flow is published
      if (isFlowPublished) return
      
      event.preventDefault()

      if (!reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const droppedData = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      )

      // Calculate drop position
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      // Convert to flow coordinates
      const flowPosition = reactFlowInstance.screenToFlowPosition(position)

      // Check if this is a composite node
      if (droppedData.type === 'composite') {
        // Get the actual composite node data
        const compositeData = getCompositeNode(droppedData.compositeNodeId)
        if (!compositeData) {
  
          return
        }

        const newNode: Node = {
          id: `composite-${Date.now()}`,
          type: 'custom',
          position: flowPosition,
          data: {
            label: compositeData.name,
            description: compositeData.description,
            icon: compositeData.icon,
            nodeType: 'composite',
            color: compositeData.color,
            compositeNodeId: compositeData.id,
            // Add connection type to help with handle rendering
            connectionType: compositeData.connectionType,
          },
        }
        setNodes((nds) => [...nds, newNode])
        return
      }

      // Handle regular node types
      const nodeType = droppedData as NodeType | DynamicNodeType
      
      // Check if this is a dynamic node type
      const isDynamicNode = 'isCustom' in nodeType && nodeType.isCustom
      
      // Create new node
      const newNode: Node = {
        id: isDynamicNode ? `${nodeType.id}-${Date.now()}` : `${(nodeType as NodeType).type}-${Date.now()}`,
        type: 'custom',
        position: flowPosition,
        data: {
          label: isDynamicNode ? nodeType.name : (nodeType as NodeType).label,
          description: nodeType.description,
          icon: nodeType.icon,
          nodeType: isDynamicNode ? nodeType.id : (nodeType as NodeType).type,
          color: nodeType.color,
          // Add dynamic node specific data
          ...(isDynamicNode && {
            dynamicNodeTypeId: nodeType.id,
            dynamicFieldValues: {},
          }),
        },
      }

      setNodes((nds) => [...nds, newNode])
    },
    [setNodes, reactFlowInstance, isFlowPublished, getCompositeNode]
  )

  // Optimized edge drop handlers are now provided by the useEdgeDrop hook

  // Persist nodes to localStorage or composite
  useEffect(() => {
    if (isCompositeEditor) {
      // For composite editor, use debounced update
      debouncedCompositeUpdate()
    } else {
      // For regular flows, use localStorage and onNodesChange
      onNodesChange?.(convertToOurNodes(nodes))
      localStorage.setItem(getStorageKey('nodes'), JSON.stringify(nodes))
    }
  }, [nodes, onNodesChange, debouncedCompositeUpdate, isCompositeEditor, getStorageKey])

  // Persist edges to localStorage or composite
  useEffect(() => {
    if (isCompositeEditor) {
      // For composite editor, use debounced update (already handled in nodes effect)
      // No need to call it again here to avoid double calls
    } else {
      // For regular flows, use localStorage and onEdgesChange
      onEdgesChange?.(convertToOurEdges(edges))
      localStorage.setItem(getStorageKey('edges'), JSON.stringify(edges))
    }
  }, [edges, onEdgesChange, isCompositeEditor, getStorageKey])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (compositeUpdateTimeoutRef.current) {
        clearTimeout(compositeUpdateTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div 
      ref={reactFlowWrapper}
      className="flex-1 h-full"
      style={{ height: '100%' }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Read-only overlay for published flows */}
      {isFlowPublished && (
        <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none">
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-auto">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Published - Read Only</span>
            </div>
          </div>
        </div>
      )}



      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChangeInternal}
        onConnect={isFlowPublished ? undefined : onConnect}
        onConnectEnd={isFlowPublished ? undefined : handleConnectEnd}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
        nodesDraggable={!isFlowPublished}
        nodesConnectable={!isFlowPublished}
        elementsSelectable={!isFlowPublished}
        selectNodesOnDrag={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={false}
        preventScrolling={true}
        onSelectionChange={isFlowPublished ? undefined : onSelectionChange}
        onEdgeDoubleClick={isFlowPublished ? undefined : handleEdgeDoubleClick}
      >
        <Background 
          color={isDark ? "#ffffff" : "#6b7280"} 
          gap={16} 
          size={1} 
        />
        <Controls />
        <MiniMap 
          nodeColor={isDark ? "#3b82f6" : "#1f2937"}
          maskColor={isDark ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"}
        />
      </ReactFlow>
      
      {/* Node Configuration Modal */}
      {selectedNode && (
        <NodeConfigModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          nodeData={selectedNode.data as unknown as CustomNodeData}
          onSave={handleModalSave}
          onDelete={handleNodeDelete}
        />
      )}

      {/* Optimized Edge Drop Modal - Only show when flow is not published */}
      {!isFlowPublished && (
        <EdgeDropModal
          isOpen={edgeDropState.isOpen}
          onClose={closeModal}
          onSelect={handleNodeTypeSelect}
          position={edgeDropState.position || undefined}
          sourceNodeLabel={edgeDropState.fromNodeLabel}
          dynamicNodeTypes={dynamicNodeTypes}
        />
      )}


    </div>
  )
}

/**
 * Flow canvas component for creating and editing workflows
 */
export const FlowCanvas: React.FC<FlowCanvasProps> = ({ isFlowPublished, ...props }) => {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} isFlowPublished={isFlowPublished} />
    </ReactFlowProvider>
  )
} 