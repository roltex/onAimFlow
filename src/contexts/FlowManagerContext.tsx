import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Flow, FlowValidationResult, DynamicNodeType } from '../types'
import { validateFlow } from '../utils/flowValidation'

const FLOWS_STORAGE_KEY = 'onAimFlow-flows'

interface FlowManagerContextType {
  flows: Flow[]
  createFlow: (name: string, description?: string) => Flow
  deleteFlow: (flowId: string) => void
  updateFlow: (flowId: string, updates: Partial<Flow>) => void
  getFlow: (flowId: string) => Flow | undefined
  updateFlowStats: (flowId: string, nodeCount: number, edgeCount: number) => void
  publishFlow: (flowId: string, dynamicNodeTypes?: DynamicNodeType[]) => FlowValidationResult
  unpublishFlow: (flowId: string) => void
  toggleFlowPublished: (flowId: string, dynamicNodeTypes?: DynamicNodeType[]) => FlowValidationResult
  validateFlowForPublish: (flowId: string, dynamicNodeTypes?: DynamicNodeType[]) => FlowValidationResult
}

const FlowManagerContext = createContext<FlowManagerContextType | undefined>(undefined)

/**
 * Helper function to load flow data from localStorage
 */
const loadFlowData = (flowId: string) => {
  try {
    const savedNodes = localStorage.getItem(`onAimFlow-nodes-${flowId}`)
    const savedEdges = localStorage.getItem(`onAimFlow-edges-${flowId}`)
    
    const nodes = savedNodes ? JSON.parse(savedNodes) : []
    const edges = savedEdges ? JSON.parse(savedEdges) : []
    
    return { nodes, edges }
  } catch (error) {
    console.error('Failed to load flow data:', error)
    return { nodes: [], edges: [] }
  }
}

/**
 * FlowManagerProvider component that provides flow management functionality
 */
export const FlowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flows, setFlows] = useState<Flow[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load flows from localStorage
  useEffect(() => {
    const savedFlows = localStorage.getItem(FLOWS_STORAGE_KEY)
    
    if (savedFlows) {
      try {
        const parsedFlows = JSON.parse(savedFlows).map((flow: any) => ({
          ...flow,
          createdAt: new Date(flow.createdAt),
          updatedAt: new Date(flow.updatedAt),
        }))
        setFlows(parsedFlows)
      } catch (error) {
        console.error('Failed to load flows:', error)
        setFlows([])
      }
    } else {
      setFlows([])
    }
    setIsInitialized(true)
  }, [])

  // Persist flows to localStorage whenever flows state changes (but only after initialization)
  useEffect(() => {
    if (!isInitialized) return // Don't persist during initial load
    
    localStorage.setItem(FLOWS_STORAGE_KEY, JSON.stringify(flows))
  }, [flows, isInitialized])

  // Generate unique flow ID
  const generateUniqueFlowId = useCallback(() => {
    let id: string
    do {
      id = `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    } while (flows.some(flow => flow.id === id))
    return id
  }, [flows])

  // Create a new flow
  const createFlow = useCallback((name: string, description?: string): Flow => {
    // Check for duplicate names
    const existingFlow = flows.find(flow => flow.name.toLowerCase() === name.toLowerCase())
    if (existingFlow) {
      throw new Error(`A flow with the name "${name}" already exists. Please choose a different name.`)
    }

    const newFlow: Flow = {
      id: generateUniqueFlowId(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      nodeCount: 0,
      edgeCount: 0,
      published: false, // Add published field
    }

    setFlows(prevFlows => [...prevFlows, newFlow])
    
    return newFlow
  }, [generateUniqueFlowId, flows])

  // Delete a flow
  const deleteFlow = useCallback((flowId: string) => {
    setFlows(prevFlows => prevFlows.filter(flow => flow.id !== flowId))
    
    // Also remove the flow data from localStorage
    localStorage.removeItem(`onAimFlow-nodes-${flowId}`)
    localStorage.removeItem(`onAimFlow-edges-${flowId}`)
  }, [])

  // Update flow metadata
  const updateFlow = useCallback((flowId: string, updates: Partial<Flow>) => {
    setFlows(prevFlows => 
      prevFlows.map(flow => 
        flow.id === flowId 
          ? { ...flow, ...updates, updatedAt: new Date() }
          : flow
      )
    )
  }, [])

  // Get a specific flow - use current state to avoid race conditions
  const getFlow = useCallback((flowId: string) => {
    return flows.find((flow: Flow) => flow.id === flowId)
  }, [flows])

  // Update flow stats (node and edge counts)
  const updateFlowStats = useCallback((flowId: string, nodeCount: number, edgeCount: number) => {
    setFlows(prevFlows => 
      prevFlows.map(flow => 
        flow.id === flowId 
          ? { ...flow, nodeCount, edgeCount, updatedAt: new Date() }
          : flow
      )
    )
  }, [])

  // Publish a flow
  const publishFlow = useCallback((flowId: string, dynamicNodeTypes: DynamicNodeType[] = []) => {
    const flow = flows.find(f => f.id === flowId)
    if (!flow) {
      throw new Error(`Flow with ID ${flowId} not found.`)
    }

    const { nodes, edges } = loadFlowData(flowId)
    const validationResult = validateFlow(nodes, edges, dynamicNodeTypes)
    
    if (validationResult.isValid) {
      setFlows(prevFlows => 
        prevFlows.map(f => 
          f.id === flowId 
            ? { ...f, published: true, updatedAt: new Date() }
            : f
        )
      )
    }
    
    return validationResult
  }, [flows])

  // Unpublish a flow
  const unpublishFlow = useCallback((flowId: string) => {
    setFlows(prevFlows => 
      prevFlows.map(flow => 
        flow.id === flowId 
          ? { ...flow, published: false, updatedAt: new Date() }
          : flow
      )
    )
  }, [])

  // Toggle flow published status
  const toggleFlowPublished = useCallback((flowId: string, dynamicNodeTypes: DynamicNodeType[] = []) => {
    const flow = flows.find(f => f.id === flowId)
    if (!flow) {
      throw new Error(`Flow with ID ${flowId} not found.`)
    }

    if (flow.published) {
      // If currently published, just unpublish without validation
      setFlows(prevFlows => 
        prevFlows.map(f => 
          f.id === flowId 
            ? { ...f, published: false, updatedAt: new Date() }
            : f
        )
      )
      return { isValid: true, errors: [] }
    } else {
      // If currently unpublished, validate before publishing
      const { nodes, edges } = loadFlowData(flowId)
      const validationResult = validateFlow(nodes, edges, dynamicNodeTypes)
      
      if (validationResult.isValid) {
        setFlows(prevFlows => 
          prevFlows.map(f => 
            f.id === flowId 
              ? { ...f, published: true, updatedAt: new Date() }
              : f
          )
        )
      }
      
      return validationResult
    }
  }, [flows])

  // Validate a flow for publishing
  const validateFlowForPublish = useCallback((flowId: string, dynamicNodeTypes: DynamicNodeType[] = []) => {
    const flow = flows.find(f => f.id === flowId)
    if (!flow) {
      throw new Error(`Flow with ID ${flowId} not found.`)
    }
    
    const { nodes, edges } = loadFlowData(flowId)
    return validateFlow(nodes, edges, dynamicNodeTypes)
  }, [flows])

  const value: FlowManagerContextType = {
    flows,
    createFlow,
    deleteFlow,
    updateFlow,
    getFlow,
    updateFlowStats,
    publishFlow,
    unpublishFlow,
    toggleFlowPublished,
    validateFlowForPublish,
  }

  return (
    <FlowManagerContext.Provider value={value}>
      {children}
    </FlowManagerContext.Provider>
  )
}

/**
 * Hook to use the FlowManagerContext
 */
export const useFlowManager = (): FlowManagerContextType => {
  const context = useContext(FlowManagerContext)
  if (!context) {
    throw new Error('useFlowManager must be used within a FlowManagerProvider')
  }
  return context
} 