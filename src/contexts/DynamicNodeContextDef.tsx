import { createContext } from 'react'
import type { DynamicNodeType } from '../types'

interface DynamicNodeContextType {
  dynamicNodeTypes: DynamicNodeType[]
  createDynamicNodeType: (nodeType: Omit<DynamicNodeType, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>) => DynamicNodeType
  updateDynamicNodeType: (id: string, updates: Partial<DynamicNodeType>) => void
  deleteDynamicNodeType: (id: string) => void
  getDynamicNodeType: (id: string) => DynamicNodeType | undefined
  getAllNodeTypes: () => (DynamicNodeType | Record<string, unknown>)[]
  importDynamicNodeTypes: (nodeTypes: DynamicNodeType[]) => void
  exportDynamicNodeTypes: (nodeTypeIds?: string[]) => void
}

export const DynamicNodeContext = createContext<DynamicNodeContextType | undefined>(undefined) 