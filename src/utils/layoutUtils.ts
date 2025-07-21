import dagre from '@dagrejs/dagre'
import type { Node, Edge, Position } from '@xyflow/react'

// Node dimensions for layout calculation (increased for more spacing)
const nodeWidth = 280
const nodeHeight = 120

export type LayoutDirection = 'TB' | 'LR' | 'BT' | 'RL'

interface LayoutPreferences {
  defaultDirection: LayoutDirection
}

const LAYOUT_STORAGE_KEY = 'onAimFlow-defaultLayout'

const DEFAULT_LAYOUT_PREFERENCES: LayoutPreferences = {
  defaultDirection: 'TB'
}

/**
 * Save layout preferences to localStorage
 */
export const saveLayoutPreferences = (preferences: Partial<LayoutPreferences>) => {
  try {
    if (preferences.defaultDirection) {
      localStorage.setItem(LAYOUT_STORAGE_KEY, preferences.defaultDirection)
    }
  } catch (error) {
    console.warn('Failed to save layout preferences to localStorage:', error)
  }
}

/**
 * Load layout preferences from localStorage
 */
export const loadLayoutPreferences = (): LayoutPreferences => {
  try {
    const defaultDirection = localStorage.getItem(LAYOUT_STORAGE_KEY) as LayoutDirection
    return {
      defaultDirection: defaultDirection || DEFAULT_LAYOUT_PREFERENCES.defaultDirection
    }
  } catch (error) {
    console.warn('Failed to load layout preferences from localStorage:', error)
    return DEFAULT_LAYOUT_PREFERENCES
  }
}

/**
 * Get the default layout direction
 */
export const getDefaultLayoutDirection = (): LayoutDirection => {
  try {
    const preferences = loadLayoutPreferences()
    return preferences.defaultDirection
  } catch (error) {
    console.warn('Failed to load default layout direction:', error)
    return DEFAULT_LAYOUT_PREFERENCES.defaultDirection
  }
}

/**
 * Get layouted elements using dagre
 */
export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: LayoutDirection = 'TB'
) => {
  const isHorizontal = direction === 'LR' || direction === 'RL'
  
  // Create a new dagre graph instance
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  
  // Set graph direction and spacing
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 80,  // Vertical spacing between nodes
    edgesep: 40,  // Minimum edge length
    ranksep: 120  // Horizontal spacing between ranks
  })

  // Add nodes to the graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // Calculate layout
  dagre.layout(dagreGraph)

  // Get the positioned nodes
  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    
    return {
      ...node,
      // Set target and source positions based on layout direction
      targetPosition: (isHorizontal ? 'left' : 'top') as Position,
      sourcePosition: (isHorizontal ? 'right' : 'bottom') as Position,
      // Position the node (dagre positions are center-based, React Flow uses top-left)
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    }
  })

  return { nodes: newNodes, edges }
}

/**
 * Get layout direction label
 */
export const getLayoutDirectionLabel = (direction: LayoutDirection): string => {
  switch (direction) {
    case 'TB':
      return 'Vertical (Top to Bottom)'
    case 'LR':
      return 'Horizontal (Left to Right)'
    case 'BT':
      return 'Vertical (Bottom to Top)'
    case 'RL':
      return 'Horizontal (Right to Left)'
    default:
      return 'Vertical'
  }
}

/**
 * Get layout direction icon
 */
export const getLayoutDirectionIcon = (direction: LayoutDirection): string => {
  switch (direction) {
    case 'TB':
      return '⬇️'
    case 'LR':
      return '➡️'
    case 'BT':
      return '⬆️'
    case 'RL':
      return '⬅️'
    default:
      return '⬇️'
  }
} 