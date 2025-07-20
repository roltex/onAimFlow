import { useCallback, useState } from 'react'
import { useReactFlow, type Node, type Edge } from '@xyflow/react'
import type { NodeType, DynamicNodeType } from '../types'

interface EdgeDropState {
  isOpen: boolean
  position: { x: number; y: number } | null
  edgeId: string | null
  fromNodeId: string | null
  fromNodeLabel?: string
}

interface UseEdgeDropReturn {
  edgeDropState: EdgeDropState
  handleConnectEnd: (event: MouseEvent | TouchEvent, connectionState: any) => void
  handleEdgeDoubleClick: (event: React.MouseEvent, edge: Edge) => void
  handleNodeTypeSelect: (nodeType: NodeType | DynamicNodeType) => void
  closeModal: () => void
  createNodeAtPosition: (nodeType: NodeType | DynamicNodeType, position: { x: number; y: number }) => Node
  createEdge: (sourceId: string, targetId: string) => Edge
  splitEdge: (edgeId: string, newNodeId: string) => { edge1: Edge; edge2: Edge }
}

/**
 * Custom hook for optimized edge drop functionality
 */
export const useEdgeDrop = (
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void,
  isDark: boolean
): UseEdgeDropReturn => {
  const { screenToFlowPosition } = useReactFlow()
  const [edgeDropState, setEdgeDropState] = useState<EdgeDropState>({
    isOpen: false,
    position: null,
    edgeId: null,
    fromNodeId: null,
    fromNodeLabel: undefined
  })

  // Memoized node creation function
  const createNodeAtPosition = useCallback((nodeType: NodeType | DynamicNodeType, position: { x: number; y: number }): Node => {
    const flowPosition = screenToFlowPosition(position)
    
    // Check if this is a dynamic node type
    const isDynamicNode = 'isCustom' in nodeType && nodeType.isCustom
    
    return {
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
  }, [screenToFlowPosition])

  // Memoized edge creation function
  const createEdge = useCallback((sourceId: string, targetId: string): Edge => {
    return {
      id: `edge-${Date.now()}`,
      source: sourceId,
      target: targetId,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: isDark ? '#60a5fa' : '#3b82f6',
        strokeWidth: 3,
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
      },
    }
  }, [isDark])

  // Memoized edge splitting function
  const splitEdge = useCallback((edgeId: string, newNodeId: string): { edge1: Edge; edge2: Edge } => {
    const edge = edges.find(e => e.id === edgeId)
    if (!edge) {
      throw new Error(`Edge with id ${edgeId} not found`)
    }

    const edge1: Edge = {
      id: `edge-${Date.now()}-1`,
      source: edge.source,
      target: newNodeId,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: isDark ? '#60a5fa' : '#3b82f6',
        strokeWidth: 3,
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
      },
    }

    const edge2: Edge = {
      id: `edge-${Date.now()}-2`,
      source: newNodeId,
      target: edge.target,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: isDark ? '#60a5fa' : '#3b82f6',
        strokeWidth: 3,
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
      },
    }

    return { edge1, edge2 }
  }, [edges, isDark])

  // Optimized connection end handler
  const handleConnectEnd = useCallback((event: MouseEvent | TouchEvent, connectionState: any) => {
    if (!connectionState.isValid) {
      const { clientX, clientY } =
        'changedTouches' in event ? event.changedTouches[0] : event

      // Get source node label for better UX
      const sourceNode = nodes.find(n => n.id === connectionState.fromNode?.id)
      const sourceNodeLabel = sourceNode?.data?.label as string | undefined

      setEdgeDropState({
        isOpen: true,
        position: { x: clientX, y: clientY },
        edgeId: null,
        fromNodeId: connectionState.fromNode?.id || null,
        fromNodeLabel: sourceNodeLabel
      })
    }
  }, [nodes])

  // Optimized edge double click handler
  const handleEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setEdgeDropState({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      edgeId: edge.id,
      fromNodeId: null,
      fromNodeLabel: undefined
    })
  }, [])

  // Optimized node type selection handler
  const handleNodeTypeSelect = useCallback((nodeType: NodeType | DynamicNodeType) => {
    if (!edgeDropState.position) return

    const newNode = createNodeAtPosition(nodeType, edgeDropState.position)
    setNodes(nds => [...nds, newNode])

    if (edgeDropState.edgeId) {
      // Scenario 1: Inserting node on existing edge
      try {
        const { edge1, edge2 } = splitEdge(edgeDropState.edgeId, newNode.id)
        setEdges(eds => eds.filter(e => e.id !== edgeDropState.edgeId).concat([edge1, edge2]))
      } catch (error) {
        console.error('Failed to split edge:', error)
      }
    } else if (edgeDropState.fromNodeId) {
      // Scenario 2: Creating connection from existing node to new node
      const newEdge = createEdge(edgeDropState.fromNodeId, newNode.id)
      setEdges(eds => [...eds, newEdge])
    }

    closeModal()
  }, [edgeDropState, createNodeAtPosition, createEdge, splitEdge, setNodes, setEdges])

  // Optimized modal close handler
  const closeModal = useCallback(() => {
    setEdgeDropState({
      isOpen: false,
      position: null,
      edgeId: null,
      fromNodeId: null,
      fromNodeLabel: undefined
    })
  }, [])

  return {
    edgeDropState,
    handleConnectEnd,
    handleEdgeDoubleClick,
    handleNodeTypeSelect,
    closeModal,
    createNodeAtPosition,
    createEdge,
    splitEdge
  }
} 