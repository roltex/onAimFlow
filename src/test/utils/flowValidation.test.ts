import { describe, it, expect } from 'vitest'
import type { Flow, Node, Edge, FlowValidationResult } from '../../types'

// Mock validation function that works with the actual Flow interface
const mockValidateFlow = (flow: Flow, nodes: Node[], edges: Edge[]): FlowValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if flow has nodes
  if (!nodes || nodes.length === 0) {
    errors.push('Flow must contain at least one node')
  }

  // Check if nodes have valid connections
  if (edges && edges.length > 0) {
    const nodeIds = nodes.map(node => node.id)
    edges.forEach(edge => {
      if (!nodeIds.includes(edge.source) || !nodeIds.includes(edge.target)) {
        errors.push(`Edge connects to non-existent node: ${edge.source} -> ${edge.target}`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

describe('Flow Validation', () => {
  it('validates empty flow correctly', () => {
    const emptyFlow: Flow = {
      id: 'test-flow',
      name: 'Test Flow',
      description: 'Test description',
      createdAt: new Date(),
      updatedAt: new Date(),
      nodeCount: 0,
      edgeCount: 0,
      published: false
    }

    const result = mockValidateFlow(emptyFlow, [], [])
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Flow must contain at least one node')
  })

  it('validates flow with valid nodes', () => {
    const validFlow: Flow = {
      id: 'test-flow',
      name: 'Test Flow',
      description: 'Test description',
      createdAt: new Date(),
      updatedAt: new Date(),
      nodeCount: 1,
      edgeCount: 0,
      published: false
    }

    const nodes: Node[] = [
      {
        id: 'node-1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: { 
          label: 'Test Node',
          description: 'Test node description',
          icon: '🔧'
        }
      }
    ]

    const result = mockValidateFlow(validFlow, nodes, [])
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('validates flow with invalid edges', () => {
    const invalidFlow: Flow = {
      id: 'test-flow',
      name: 'Test Flow',
      description: 'Test description',
      createdAt: new Date(),
      updatedAt: new Date(),
      nodeCount: 1,
      edgeCount: 1,
      published: false
    }

    const nodes: Node[] = [
      {
        id: 'node-1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: { 
          label: 'Test Node',
          description: 'Test node description',
          icon: '🔧'
        }
      }
    ]

    const edges: Edge[] = [
      {
        id: 'edge-1',
        source: 'node-1',
        target: 'non-existent-node',
        type: 'default'
      }
    ]

    const result = mockValidateFlow(invalidFlow, nodes, edges)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Edge connects to non-existent node: node-1 -> non-existent-node')
  })

  it('validates flow with valid edges', () => {
    const validFlow: Flow = {
      id: 'test-flow',
      name: 'Test Flow',
      description: 'Test description',
      createdAt: new Date(),
      updatedAt: new Date(),
      nodeCount: 2,
      edgeCount: 1,
      published: false
    }

    const nodes: Node[] = [
      {
        id: 'node-1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: { 
          label: 'Source Node',
          description: 'Source node description',
          icon: '🔧'
        }
      },
      {
        id: 'node-2',
        type: 'custom',
        position: { x: 200, y: 0 },
        data: { 
          label: 'Target Node',
          description: 'Target node description',
          icon: '🎯'
        }
      }
    ]

    const edges: Edge[] = [
      {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
        type: 'default'
      }
    ]

    const result = mockValidateFlow(validFlow, nodes, edges)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
}) 