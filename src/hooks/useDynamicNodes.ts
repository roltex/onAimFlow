import { useContext } from 'react'
import { DynamicNodeContext } from '../contexts/DynamicNodeContextDef'

/**
 * Hook to use the DynamicNode context
 */
export const useDynamicNodes = () => {
  const context = useContext(DynamicNodeContext)
  if (context === undefined) {
    throw new Error('useDynamicNodes must be used within a DynamicNodeProvider')
  }
  return context
} 