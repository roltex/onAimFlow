import { createContext } from 'react'
import type { Flow, FlowValidationResult, DynamicNodeType } from '../types'

interface FlowManagerContextType {
  flows: Flow[]
  isInitialized: boolean
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

export const FlowManagerContext = createContext<FlowManagerContextType | undefined>(undefined) 