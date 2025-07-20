import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { DynamicNodeType } from '../types'

const DYNAMIC_NODES_STORAGE_KEY = 'onAimFlow-dynamic-nodes'

interface DynamicNodeContextType {
  dynamicNodeTypes: DynamicNodeType[]
  createDynamicNodeType: (nodeType: Omit<DynamicNodeType, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>) => DynamicNodeType
  updateDynamicNodeType: (id: string, updates: Partial<DynamicNodeType>) => void
  deleteDynamicNodeType: (id: string) => void
  getDynamicNodeType: (id: string) => DynamicNodeType | undefined
  getAllNodeTypes: () => (DynamicNodeType | any)[]
  importDynamicNodeTypes: (nodeTypes: DynamicNodeType[]) => void
  exportDynamicNodeTypes: (nodeTypeIds?: string[]) => void
}

const DynamicNodeContext = createContext<DynamicNodeContextType | undefined>(undefined)

/**
 * DynamicNodeProvider component that provides dynamic node type management
 */
export const DynamicNodeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dynamicNodeTypes, setDynamicNodeTypes] = useState<DynamicNodeType[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load dynamic node types from localStorage
  useEffect(() => {
    const savedDynamicNodes = localStorage.getItem(DYNAMIC_NODES_STORAGE_KEY)
    
    if (savedDynamicNodes) {
      try {
        const parsedDynamicNodes = JSON.parse(savedDynamicNodes).map((nodeType: any) => ({
          ...nodeType,
          createdAt: new Date(nodeType.createdAt),
          updatedAt: new Date(nodeType.updatedAt),
        }))
        setDynamicNodeTypes(parsedDynamicNodes)
      } catch (error) {
        console.error('Failed to load dynamic node types:', error)
        setDynamicNodeTypes([])
      }
    } else {
      setDynamicNodeTypes([])
    }
    setIsInitialized(true)
  }, [])

  // Persist dynamic node types to localStorage
  useEffect(() => {
    if (!isInitialized) return
    
    localStorage.setItem(DYNAMIC_NODES_STORAGE_KEY, JSON.stringify(dynamicNodeTypes))
  }, [dynamicNodeTypes, isInitialized])

  // Generate unique ID
  const generateUniqueId = useCallback(() => {
    let id: string
    do {
      id = `dynamic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    } while (dynamicNodeTypes.some(nodeType => nodeType.id === id))
    return id
  }, [dynamicNodeTypes])

  // Create a new dynamic node type
  const createDynamicNodeType = useCallback((nodeTypeData: Omit<DynamicNodeType, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>): DynamicNodeType => {
    // Check for duplicate names
    const existingNodeType = dynamicNodeTypes.find(nodeType => nodeType.name.toLowerCase() === nodeTypeData.name.toLowerCase())
    if (existingNodeType) {
      throw new Error(`A node type with the name "${nodeTypeData.name}" already exists. Please choose a different name.`)
    }

    const newDynamicNodeType: DynamicNodeType = {
      ...nodeTypeData,
      id: generateUniqueId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isCustom: true,
    }

    setDynamicNodeTypes(prev => [...prev, newDynamicNodeType])
    
    return newDynamicNodeType
  }, [dynamicNodeTypes, generateUniqueId])

  // Update a dynamic node type
  const updateDynamicNodeType = useCallback((id: string, updates: Partial<DynamicNodeType>) => {
    setDynamicNodeTypes(prev => 
      prev.map(nodeType => 
        nodeType.id === id 
          ? { ...nodeType, ...updates, updatedAt: new Date() }
          : nodeType
      )
    )
  }, [])

  // Delete a dynamic node type
  const deleteDynamicNodeType = useCallback((id: string) => {
    setDynamicNodeTypes(prev => prev.filter(nodeType => nodeType.id !== id))
  }, [])

  // Get a specific dynamic node type
  const getDynamicNodeType = useCallback((id: string) => {
    return dynamicNodeTypes.find(nodeType => nodeType.id === id)
  }, [dynamicNodeTypes])

  // Get all node types (built-in + dynamic)
  const getAllNodeTypes = useCallback(() => {
    // Built-in node types
    const builtInNodeTypes = [
      {
        id: 'event',
        type: 'event',
        label: 'EVENT',
        description: 'Trigger events and actions',
        icon: '⚡',
        color: 'from-blue-500 to-blue-600',
        category: 'trigger'
      },
      {
        id: 'filter',
        type: 'filter',
        label: 'FILTER',
        description: 'Filter and validate data',
        icon: '🔍',
        color: 'from-green-500 to-green-600',
        category: 'process'
      },
      {
        id: 'select',
        type: 'select',
        label: 'SELECT',
        description: 'Select and transform data',
        icon: '📊',
        color: 'from-purple-500 to-purple-600',
        category: 'process'
      },
      {
        id: 'output',
        type: 'output',
        label: 'OUTPUT',
        description: 'Output and export results',
        icon: '📤',
        color: 'from-orange-500 to-orange-600',
        category: 'output'
      }
    ]

    return [...builtInNodeTypes, ...dynamicNodeTypes]
  }, [dynamicNodeTypes])

  // Import dynamic node types
  const importDynamicNodeTypes = useCallback((nodeTypes: DynamicNodeType[]) => {
    // Generate new IDs for imported node types to avoid conflicts
    const importedNodeTypes = nodeTypes.map(nodeType => ({
      ...nodeType,
      id: generateUniqueId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isCustom: true,
    }))

    setDynamicNodeTypes(prev => [...prev, ...importedNodeTypes])
  }, [generateUniqueId])

  // Export dynamic node types
  const exportDynamicNodeTypes = useCallback((nodeTypeIds?: string[]) => {
    try {
      // If no IDs specified, export all dynamic node types
      const nodeTypesToExport = nodeTypeIds 
        ? dynamicNodeTypes.filter(nodeType => nodeTypeIds.includes(nodeType.id))
        : dynamicNodeTypes

      if (nodeTypesToExport.length === 0) {
        throw new Error('No node types selected for export')
      }

      const dataStr = JSON.stringify(nodeTypesToExport, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `onAimFlow-custom-nodes-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('Export failed:', error)
      throw error
    }
  }, [dynamicNodeTypes])

  return (
    <DynamicNodeContext.Provider value={{
      dynamicNodeTypes,
      createDynamicNodeType,
      updateDynamicNodeType,
      deleteDynamicNodeType,
      getDynamicNodeType,
      getAllNodeTypes,
      importDynamicNodeTypes,
      exportDynamicNodeTypes,
    }}>
      {children}
    </DynamicNodeContext.Provider>
  )
}

/**
 * Hook to use the dynamic node context
 */
export const useDynamicNodes = (): DynamicNodeContextType => {
  const context = useContext(DynamicNodeContext)
  if (!context) {
    throw new Error('useDynamicNodes must be used within a DynamicNodeProvider')
  }
  return context
} 