import type { CompositeNode, Node, Edge, ExposedPort } from '../types'
import type { DynamicNodeType } from '../types'

export interface CompositeValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validates a composite node structure
 */
export const validateCompositeNode = (composite: CompositeNode): CompositeValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  // Basic validation
  if (!composite.name || composite.name.trim() === '') {
    errors.push('Composite node must have a name')
  }

  if (!composite.description || composite.description.trim() === '') {
    warnings.push('Composite node should have a description')
  }

  // Internal structure validation
  if (!composite.internalNodes || composite.internalNodes.length === 0) {
    errors.push('Composite node must contain at least one internal node')
  }

  if (!composite.internalEdges) {
    errors.push('Composite node must have internal edges array')
  }

  // Validate internal nodes
  if (composite.internalNodes) {
    const nodeIds = new Set<string>()
    
    composite.internalNodes.forEach((node, index) => {
      if (!node.id) {
        errors.push(`Internal node at index ${index} is missing an ID`)
      } else if (nodeIds.has(node.id)) {
        errors.push(`Duplicate node ID found: ${node.id}`)
      } else {
        nodeIds.add(node.id)
      }

      if (!node.data) {
        errors.push(`Internal node ${node.id} is missing data`)
      }
    })
  }

  // Validate internal edges
  if (composite.internalEdges) {
    const nodeIds = new Set(composite.internalNodes?.map(n => n.id) || [])
    
    composite.internalEdges.forEach((edge, index) => {
      if (!edge.source || !edge.target) {
        errors.push(`Edge at index ${index} is missing source or target`)
      } else if (!nodeIds.has(edge.source)) {
        errors.push(`Edge references non-existent source node: ${edge.source}`)
      } else if (!nodeIds.has(edge.target)) {
        errors.push(`Edge references non-existent target node: ${edge.target}`)
      }
    })
  }

  // Validate exposed ports
  if (!composite.exposedInputs || !composite.exposedOutputs) {
    errors.push('Composite node must have exposed inputs and outputs arrays')
  } else {
    const nodeIds = new Set(composite.internalNodes?.map(n => n.id) || [])
    
    // Validate exposed inputs
    const inputPortIds = new Set<string>()
    composite.exposedInputs.forEach((port, index) => {
      if (!port.id) {
        errors.push(`Exposed input port at index ${index} is missing an ID`)
      } else if (inputPortIds.has(port.id)) {
        errors.push(`Duplicate exposed input port ID: ${port.id}`)
      } else {
        inputPortIds.add(port.id)
      }

      if (!port.name || port.name.trim() === '') {
        errors.push(`Exposed input port ${port.id} is missing a name`)
      }

      if (!port.internalNodeId) {
        errors.push(`Exposed input port ${port.id} is missing internal node ID`)
      } else if (!nodeIds.has(port.internalNodeId)) {
        errors.push(`Exposed input port ${port.id} references non-existent internal node: ${port.internalNodeId}`)
      }
    })

    // Validate exposed outputs
    const outputPortIds = new Set<string>()
    composite.exposedOutputs.forEach((port, index) => {
      if (!port.id) {
        errors.push(`Exposed output port at index ${index} is missing an ID`)
      } else if (outputPortIds.has(port.id)) {
        errors.push(`Duplicate exposed output port ID: ${port.id}`)
      } else {
        outputPortIds.add(port.id)
      }

      if (!port.name || port.name.trim() === '') {
        errors.push(`Exposed output port ${port.id} is missing a name`)
      }

      if (!port.internalNodeId) {
        errors.push(`Exposed output port ${port.id} is missing internal node ID`)
      } else if (!nodeIds.has(port.internalNodeId)) {
        errors.push(`Exposed output port ${port.id} references non-existent internal node: ${port.internalNodeId}`)
      }
    })
  }

  // Check for disconnected nodes
  if (composite.internalNodes && composite.internalEdges) {
    const connectedNodeIds = new Set<string>()
    
    composite.internalEdges.forEach(edge => {
      connectedNodeIds.add(edge.source)
      connectedNodeIds.add(edge.target)
    })

    const disconnectedNodes = composite.internalNodes.filter(node => !connectedNodeIds.has(node.id))
    if (disconnectedNodes.length > 0) {
      warnings.push(`${disconnectedNodes.length} internal node(s) are not connected to the composite structure`)
    }
  }

  // Check for cycles (basic check)
  if (composite.internalEdges && composite.internalEdges.length > 0) {
    const hasCycle = detectCycles(composite.internalNodes || [], composite.internalEdges)
    if (hasCycle) {
      warnings.push('Composite contains cycles which may cause infinite loops')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Detects cycles in a directed graph (basic implementation)
 */
const detectCycles = (nodes: Node[], edges: Edge[]): boolean => {
  const graph = new Map<string, string[]>()
  
  // Build adjacency list
  nodes.forEach(node => {
    graph.set(node.id, [])
  })
  
  edges.forEach(edge => {
    const neighbors = graph.get(edge.source) || []
    neighbors.push(edge.target)
    graph.set(edge.source, neighbors)
  })

  // DFS to detect cycles
  const visited = new Set<string>()
  const recStack = new Set<string>()

  const hasCycleDFS = (nodeId: string): boolean => {
    if (recStack.has(nodeId)) return true
    if (visited.has(nodeId)) return false

    visited.add(nodeId)
    recStack.add(nodeId)

    const neighbors = graph.get(nodeId) || []
    for (const neighbor of neighbors) {
      if (hasCycleDFS(neighbor)) return true
    }

    recStack.delete(nodeId)
    return false
  }

  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId)) {
      if (hasCycleDFS(nodeId)) return true
    }
  }

  return false
}

/**
 * Validates that a composite node can be created from selected nodes and edges
 */
export const validateCompositeCreation = (
  selectedNodes: Node[],
  selectedEdges: Edge[],
  exposedInputs: ExposedPort[],
  exposedOutputs: ExposedPort[]
): CompositeValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (selectedNodes.length === 0) {
    errors.push('At least one node must be selected')
  }

  if (selectedNodes.length === 1) {
    warnings.push('Creating a composite with only one node may not be useful')
  }

  // Check if all edges connect to selected nodes
  const selectedNodeIds = new Set(selectedNodes.map(n => n.id))
  const invalidEdges = selectedEdges.filter(
    edge => !selectedNodeIds.has(edge.source) || !selectedNodeIds.has(edge.target)
  )

  if (invalidEdges.length > 0) {
    errors.push('All edges must connect to selected nodes')
  }

  // Validate exposed ports
  if (exposedInputs.length === 0 && exposedOutputs.length === 0) {
    errors.push('At least one port must be exposed')
  }

  // Check for duplicate exposed port names
  const exposedPortNames = new Set<string>()
  ;[...exposedInputs, ...exposedOutputs].forEach(port => {
    if (exposedPortNames.has(port.name)) {
      errors.push(`Duplicate exposed port name: ${port.name}`)
    } else {
      exposedPortNames.add(port.name)
    }
  })

  // Check if exposed ports reference valid internal nodes
  exposedInputs.forEach(port => {
    if (!selectedNodeIds.has(port.internalNodeId)) {
      errors.push(`Exposed input port ${port.name} references non-selected node: ${port.internalNodeId}`)
    }
  })

  exposedOutputs.forEach(port => {
    if (!selectedNodeIds.has(port.internalNodeId)) {
      errors.push(`Exposed output port ${port.name} references non-selected node: ${port.internalNodeId}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Suggests exposed ports based on selected nodes
 */
export const suggestExposedPorts = (selectedNodes: Node[]): {
  inputs: ExposedPort[]
  outputs: ExposedPort[]
} => {
  const inputs: ExposedPort[] = []
  const outputs: ExposedPort[] = []

  selectedNodes.forEach((node, index) => {
    const nodeData = node.data as any

    // First node gets an input port
    if (index === 0) {
      inputs.push({
        id: `suggested-input-${node.id}`,
        name: 'Input',
        type: 'input',
        internalNodeId: node.id,
        internalPortId: 'default-input',
        description: `Input from ${nodeData.label || 'first node'}`
      })
    }

    // Last node gets an output port
    if (index === selectedNodes.length - 1) {
      outputs.push({
        id: `suggested-output-${node.id}`,
        name: 'Output',
        type: 'output',
        internalNodeId: node.id,
        internalPortId: 'default-output',
        description: `Output from ${nodeData.label || 'last node'}`
      })
    }

    // Event nodes always get output ports
    if (nodeData.nodeType === 'event') {
      outputs.push({
        id: `suggested-event-output-${node.id}`,
        name: `${nodeData.label || 'Event'} Output`,
        type: 'output',
        internalNodeId: node.id,
        internalPortId: 'event-output',
        description: `Event output from ${nodeData.label || 'event node'}`
      })
    }

    // Output nodes always get input ports
    if (nodeData.nodeType === 'output') {
      inputs.push({
        id: `suggested-output-input-${node.id}`,
        name: `${nodeData.label || 'Output'} Input`,
        type: 'input',
        internalNodeId: node.id,
        internalPortId: 'output-input',
        description: `Input to ${nodeData.label || 'output node'}`
      })
    }
  })

  return { inputs, outputs }
}

/**
 * Checks if there's a path from source to target node
 */
const hasPath = (startNodeId: string, endNodeId: string, edges: Edge[]): boolean => {
  if (startNodeId === endNodeId) return true

  // Build adjacency list
  const adjacencyList = new Map<string, string[]>()
  edges.forEach(edge => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, [])
    }
    adjacencyList.get(edge.source)!.push(edge.target)
  })

  // BFS to find path
  const queue = [startNodeId]
  const visited = new Set<string>([startNodeId])

  while (queue.length > 0) {
    const currentNode = queue.shift()!
    const neighbors = adjacencyList.get(currentNode) || []

    for (const neighbor of neighbors) {
      if (neighbor === endNodeId) {
        return true
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  return false
}

/**
 * Validates a composite node for publishing (EXACTLY same rules as flows)
 */
export const validateCompositeForPublish = (composite: CompositeNode, dynamicNodeTypes: DynamicNodeType[] = []): CompositeValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if there are any internal nodes
  if (!composite.internalNodes || composite.internalNodes.length === 0) {
    errors.push('Composite must contain at least one node')
    return { isValid: false, errors, warnings }
  }

  // Find EVENT and OUTPUT nodes in internal structure
  const eventNodes = composite.internalNodes.filter(node => {
    const data = node.data as any
    return data.nodeType === 'event'
  })
  
  const outputNodes = composite.internalNodes.filter(node => {
    const data = node.data as any
    return data.nodeType === 'output'
  })

  // Validation Rule 1: Must have at least one EVENT node
  if (eventNodes.length === 0) {
    errors.push('Composite must contain at least one EVENT node to trigger the workflow')
  }

  // Validation Rule 2: Must have at least one OUTPUT node
  if (outputNodes.length === 0) {
    errors.push('Composite must contain at least one OUTPUT node to produce results')
  }

  // Validation Rule 3: Check for disconnected nodes
  const connectedNodeIds = new Set<string>()
  composite.internalEdges?.forEach(edge => {
    connectedNodeIds.add(edge.source)
    connectedNodeIds.add(edge.target)
  })

  const disconnectedNodes = composite.internalNodes.filter(node => !connectedNodeIds.has(node.id))
  if (disconnectedNodes.length > 0) {
    if (composite.internalNodes.length > 1) { // Only error if there are multiple nodes
      const nodeNames = disconnectedNodes.map(n => (n.data as any).label || n.id).join(', ')
      errors.push(`${disconnectedNodes.length} internal node(s) are not connected: ${nodeNames}`)
    }
  }

  // Validation Rule 4: Check for valid paths from EVENT to OUTPUT
  if (eventNodes.length > 0 && outputNodes.length > 0 && composite.internalEdges && composite.internalEdges.length > 0) {
    const hasValidPath = eventNodes.some(eventNode => 
      outputNodes.some(outputNode => 
        hasPath(eventNode.id, outputNode.id, composite.internalEdges)
      )
    )

    if (!hasValidPath) {
      errors.push('There must be at least one valid path from an EVENT node to an OUTPUT node')
    }
  }

  // Validation Rule 5: Check node configurations (REQUIRED for publishing)
  const configurationErrors: string[] = []
  
  composite.internalNodes.forEach(node => {
    const data = node.data as any
    const nodeName = data.label || node.id
    
    switch (data.nodeType) {
      case 'event':
        if (!data.eventSource) {
          configurationErrors.push(`${nodeName}: Event Source is required`)
        }
        if (!data.eventType) {
          configurationErrors.push(`${nodeName}: Event Type is required`)
        }
        break
      case 'filter':
        if (!data.filterConditions || data.filterConditions.length === 0) {
          configurationErrors.push(`${nodeName}: At least one filter condition is required`)
        }
        break
      case 'select':
        if (!data.selectProperty || data.selectProperty.trim() === '') {
          configurationErrors.push(`${nodeName}: Property Name is required`)
        }
        break
      case 'output':
        if (!data.outputSteps || data.outputSteps.length === 0) {
          configurationErrors.push(`${nodeName}: At least one output step is required`)
        }
        break
      default:
        // Check custom nodes (dynamic nodes)
        if (data.dynamicNodeTypeId) {
          const dynamicNodeType = dynamicNodeTypes.find(type => type.id === data.dynamicNodeTypeId)
          if (dynamicNodeType) {
            const requiredFields = dynamicNodeType.fields.filter(field => field.required)
            const missingFields = requiredFields.filter(field => {
              const value = data.dynamicFieldValues?.[field.id]
              return value === undefined || value === null || value === ''
            })
            
            if (missingFields.length > 0) {
              const fieldNames = missingFields.map(field => field.name).join(', ')
              configurationErrors.push(`${nodeName}: Required fields missing: ${fieldNames}`)
            }
          } else {
            configurationErrors.push(`${nodeName}: Custom node type not found`)
          }
        }
        break
    }
  })

  if (configurationErrors.length > 0) {
    errors.push('Internal node configuration errors:')
    configurationErrors.forEach(error => errors.push(`• ${error}`))
  }

  // Additional validation: Check for partially configured nodes (warnings only)
  const partiallyConfiguredNodes = composite.internalNodes.filter(node => {
    const data = node.data as any
    
    switch (data.nodeType) {
      case 'event':
        // Already fully validated above, no partial states
        return false
      case 'filter':
        // Check if conditions exist but are incomplete
        return data.filterConditions && data.filterConditions.length > 0 && 
               data.filterConditions.some((condition: any) => 
                 !condition.propertyName || !condition.operator || condition.value === undefined || condition.value === ''
               )
      case 'select':
        // Already fully validated above, no partial states
        return false
      case 'output':
        // Check if steps exist but are incomplete
        return data.outputSteps && data.outputSteps.length > 0 &&
               data.outputSteps.some((step: any) => 
                 step.progress === undefined || step.point === undefined
               )
      default:
        return false
    }
  })

  if (partiallyConfiguredNodes.length > 0) {
    const nodeNames = partiallyConfiguredNodes.map(n => (n.data as any).label || n.id).join(', ')
    warnings.push(`${partiallyConfiguredNodes.length} internal node(s) have incomplete configuration: ${nodeNames}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Gets a human-readable validation summary for composites
 */
export const getCompositeValidationSummary = (result: CompositeValidationResult): string => {
  if (result.isValid) {
    return '✅ Composite is valid and ready to publish'
  }

  const errorCount = result.errors.length
  const warningCount = result.warnings?.length || 0
  
  let summary = `❌ ${errorCount} error${errorCount !== 1 ? 's' : ''} found`
  if (warningCount > 0) {
    summary += `, ${warningCount} warning${warningCount !== 1 ? 's' : ''}`
  }
  
  return summary
} 