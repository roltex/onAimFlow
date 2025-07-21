import { useContext } from 'react'
import { FlowManagerContext } from '../contexts/FlowManagerContextDef'

/**
 * Hook to use the FlowManager context
 */
export const useFlowManager = () => {
  const context = useContext(FlowManagerContext)
  if (context === undefined) {
    throw new Error('useFlowManager must be used within a FlowManagerProvider')
  }
  return context
} 