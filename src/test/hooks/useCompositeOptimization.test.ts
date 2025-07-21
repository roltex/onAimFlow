import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCompositeOptimization } from '../../hooks/useCompositeOptimization'
import type { CompositeNode, Node, Edge } from '../../types'

// Mock composite node for testing
const createMockComposite = (overrides: Partial<CompositeNode> = {}): CompositeNode => ({
  id: 'test-composite',
  name: 'Test Composite',
  description: 'Test composite for optimization',
  icon: '🔧',
  color: 'from-blue-500 to-blue-600',
  category: 'utility',
  connectionType: 'input/output',
  internalNodes: [],
  internalEdges: [],
  exposedInputs: [],
  exposedOutputs: [],
  published: true,
  metadata: {
    author: 'test',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  ...overrides
})

// Mock nodes for testing
const createMockNodes = (count: number): Node[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `node-${i}`,
    type: 'custom',
    position: { x: i * 100, y: i * 100 },
    data: {
      label: `Node ${i}`,
      description: `Test node ${i}`,
      icon: '🔧'
    }
  }))
}

// Mock edges for testing
const createMockEdges = (nodeCount: number): Edge[] => {
  const edges: Edge[] = []
  for (let i = 0; i < nodeCount - 1; i++) {
    edges.push({
      id: `edge-${i}`,
      source: `node-${i}`,
      target: `node-${i + 1}`,
      type: 'default'
    })
  }
  return edges
}

describe('useCompositeOptimization', () => {
  describe('analyzePerformance', () => {
    it('returns optimal performance for small composites', () => {
      const { result } = renderHook(() => useCompositeOptimization())
      
      const smallComposite = createMockComposite({
        internalNodes: createMockNodes(10),
        internalEdges: createMockEdges(10),
        exposedInputs: [{ id: 'input-1', name: 'Input 1', type: 'input', internalNodeId: 'node-1', internalPortId: 'port-1' }],
        exposedOutputs: [{ id: 'output-1', name: 'Output 1', type: 'output', internalNodeId: 'node-9', internalPortId: 'port-1' }]
      })

      const analysis = result.current.analyzePerformance(smallComposite)
      
      expect(analysis.isOptimized).toBe(true)
      expect(analysis.performanceScore).toBeGreaterThan(70)
      expect(analysis.recommendations).toHaveLength(0)
      expect(analysis.estimatedRenderTime).toBeGreaterThan(0)
    })

    it('returns poor performance for large composites', () => {
      const { result } = renderHook(() => useCompositeOptimization({ maxNodes: 20, maxEdges: 30 }))
      
      const largeComposite = createMockComposite({
        internalNodes: createMockNodes(50),
        internalEdges: createMockEdges(50),
        exposedInputs: Array.from({ length: 15 }, (_, i) => ({ 
          id: `input-${i}`, 
          name: `Input ${i}`, 
          type: 'input' as const, 
          internalNodeId: `node-${i}`, 
          internalPortId: `port-${i}` 
        })),
        exposedOutputs: Array.from({ length: 15 }, (_, i) => ({ 
          id: `output-${i}`, 
          name: `Output ${i}`, 
          type: 'output' as const, 
          internalNodeId: `node-${i + 30}`, 
          internalPortId: `port-${i}` 
        }))
      })

      const analysis = result.current.analyzePerformance(largeComposite)
      
      expect(analysis.isOptimized).toBe(false)
      expect(analysis.performanceScore).toBeLessThan(70)
      expect(analysis.recommendations.length).toBeGreaterThan(0)
      expect(analysis.recommendations.some(rec => rec.includes('splitting into smaller composites'))).toBe(true)
    })

    it('provides specific recommendations based on issues', () => {
      const { result } = renderHook(() => useCompositeOptimization({ maxNodes: 10, maxEdges: 10 }))
      
      const problematicComposite = createMockComposite({
        internalNodes: createMockNodes(20),
        internalEdges: createMockEdges(20),
        exposedInputs: Array.from({ length: 15 }, (_, i) => ({ 
          id: `input-${i}`, 
          name: `Input ${i}`, 
          type: 'input' as const, 
          internalNodeId: `node-${i}`, 
          internalPortId: `port-${i}` 
        })),
        exposedOutputs: Array.from({ length: 15 }, (_, i) => ({ 
          id: `output-${i}`, 
          name: `Output ${i}`, 
          type: 'output' as const, 
          internalNodeId: `node-${i + 10}`, 
          internalPortId: `port-${i}` 
        }))
      })

      const analysis = result.current.analyzePerformance(problematicComposite)
      
      expect(analysis.recommendations).toContain('Consider splitting into smaller composites (20 > 10 nodes)')
      expect(analysis.recommendations).toContain('Reduce internal connections (19 > 10 edges)')
      expect(analysis.recommendations).toContain('Limit exposed ports to essential ones (30 > 10 ports)')
    })
  })

  describe('optimizeNodePositions', () => {
    it('optimizes node positions based on connections', () => {
      const { result } = renderHook(() => useCompositeOptimization())
      
      const nodes = createMockNodes(3)
      const edges = createMockEdges(3)
      
      const optimizedNodes = result.current.optimizeNodePositions(nodes, edges)
      
      expect(optimizedNodes).toHaveLength(3)
      optimizedNodes.forEach((node, index) => {
        expect(node.id).toBe(`node-${index}`)
        expect(node.position.x).toBeGreaterThanOrEqual(0)
        expect(node.position.x).toBeLessThanOrEqual(1000)
        expect(node.position.y).toBeGreaterThanOrEqual(0)
        expect(node.position.y).toBeLessThanOrEqual(1000)
      })
    })

    it('moves unconnected nodes towards center', () => {
      const { result } = renderHook(() => useCompositeOptimization())
      
      const nodes = [
        {
          id: 'node-1',
          type: 'custom',
          position: { x: 0, y: 0 },
          data: { label: 'Node 1', description: 'Test', icon: '🔧' }
        },
        {
          id: 'node-2',
          type: 'custom',
          position: { x: 200, y: 200 },
          data: { label: 'Node 2', description: 'Test', icon: '🔧' }
        }
      ]
      const edges: Edge[] = [] // No connections
      
      const optimizedNodes = result.current.optimizeNodePositions(nodes, edges)
      
      // Check that positions have been adjusted towards center (100, 100)
      optimizedNodes.forEach((node) => {
        const originalNode = nodes.find(n => n.id === node.id)!
        if (originalNode.position.x < 100) {
          expect(node.position.x).toBeGreaterThan(originalNode.position.x)
        } else {
          expect(node.position.x).toBeLessThan(originalNode.position.x)
        }
        if (originalNode.position.y < 100) {
          expect(node.position.y).toBeGreaterThan(originalNode.position.y)
        } else {
          expect(node.position.y).toBeLessThan(originalNode.position.y)
        }
      })
    })

    it('keeps nodes within bounds', () => {
      const { result } = renderHook(() => useCompositeOptimization())
      
      const nodes = [
        {
          id: 'node-1',
          type: 'custom',
          position: { x: -100, y: -100 },
          data: { label: 'Node 1', description: 'Test', icon: '🔧' }
        },
        {
          id: 'node-2',
          type: 'custom',
          position: { x: 2000, y: 2000 },
          data: { label: 'Node 2', description: 'Test', icon: '🔧' }
        }
      ]
      const edges: Edge[] = []
      
      const optimizedNodes = result.current.optimizeNodePositions(nodes, edges)
      
      optimizedNodes.forEach(node => {
        expect(node.position.x).toBeGreaterThanOrEqual(0)
        expect(node.position.x).toBeLessThanOrEqual(1000)
        expect(node.position.y).toBeGreaterThanOrEqual(0)
        expect(node.position.y).toBeLessThanOrEqual(1000)
      })
    })
  })

  describe('caching functionality', () => {
    it('caches results when cacheResults is true', () => {
      const { result } = renderHook(() => useCompositeOptimization({ cacheResults: true }))
      
      const composite = createMockComposite({
        internalNodes: createMockNodes(5),
        internalEdges: createMockEdges(5)
      })

      // First call should compute
      const analysis1 = result.current.getOptimizedAnalysis(composite)
      
      // Second call should use cache
      const analysis2 = result.current.getOptimizedAnalysis(composite)
      
      expect(analysis1).toEqual(analysis2)
    })

    it('does not cache results when cacheResults is false', () => {
      const { result } = renderHook(() => useCompositeOptimization({ cacheResults: false }))
      
      const composite = createMockComposite({
        internalNodes: createMockNodes(5),
        internalEdges: createMockEdges(5)
      })

      const analysis1 = result.current.getOptimizedAnalysis(composite)
      const analysis2 = result.current.getOptimizedAnalysis(composite)
      
      // Results should be the same but computed each time
      expect(analysis1).toEqual(analysis2)
    })
  })

  describe('batch optimization', () => {
    it('optimizes multiple composites', () => {
      const { result } = renderHook(() => useCompositeOptimization())
      
      const composites = [
        createMockComposite({ id: 'composite-1', internalNodes: createMockNodes(5) }),
        createMockComposite({ id: 'composite-2', internalNodes: createMockNodes(15) }),
        createMockComposite({ id: 'composite-3', internalNodes: createMockNodes(25) })
      ]

      const batchResults = result.current.optimizeBatch(composites)
      
      expect(batchResults).toHaveLength(3)
      batchResults.forEach((batchResult, index) => {
        expect(batchResult.composite.id).toBe(`composite-${index + 1}`)
        expect(batchResult.optimization).toHaveProperty('isOptimized')
        expect(batchResult.optimization).toHaveProperty('performanceScore')
        expect(batchResult.optimization).toHaveProperty('recommendations')
        expect(batchResult.optimization).toHaveProperty('estimatedRenderTime')
      })
    })
  })

  describe('utility functions', () => {
    it('getRecommendations returns optimization recommendations', () => {
      const { result } = renderHook(() => useCompositeOptimization({ maxNodes: 10 }))
      
      const largeComposite = createMockComposite({
        internalNodes: createMockNodes(20)
      })

      const recommendations = result.current.getRecommendations(largeComposite)
      
      expect(Array.isArray(recommendations)).toBe(true)
      expect(recommendations.length).toBeGreaterThan(0)
      expect(recommendations.some(rec => rec.includes('splitting into smaller composites'))).toBe(true)
    })

    it('needsOptimization returns true for problematic composites', () => {
      const { result } = renderHook(() => useCompositeOptimization({ maxNodes: 10 }))
      
      const largeComposite = createMockComposite({
        internalNodes: createMockNodes(20),
        internalEdges: createMockEdges(20),
        exposedInputs: Array.from({ length: 15 }, (_, i) => ({ 
          id: `input-${i}`, 
          name: `Input ${i}`, 
          type: 'input' as const, 
          internalNodeId: `node-${i}`, 
          internalPortId: `port-${i}` 
        })),
        exposedOutputs: Array.from({ length: 15 }, (_, i) => ({ 
          id: `output-${i}`, 
          name: `Output ${i}`, 
          type: 'output' as const, 
          internalNodeId: `node-${i + 10}`, 
          internalPortId: `port-${i}` 
        }))
      })

      const needsOpt = result.current.needsOptimization(largeComposite)
      
      expect(needsOpt).toBe(true)
    })

    it('needsOptimization returns false for optimal composites', () => {
      const { result } = renderHook(() => useCompositeOptimization())
      
      const smallComposite = createMockComposite({
        internalNodes: createMockNodes(5)
      })

      const needsOpt = result.current.needsOptimization(smallComposite)
      
      expect(needsOpt).toBe(false)
    })
  })

  describe('performance calculations', () => {
    it('calculates performance score correctly', () => {
      const { result } = renderHook(() => useCompositeOptimization({ maxNodes: 10, maxEdges: 10 }))
      
      const composite = createMockComposite({
        internalNodes: createMockNodes(15),
        internalEdges: createMockEdges(15)
      })

      const analysis = result.current.analyzePerformance(composite)
      
      expect(analysis.performanceScore).toBeGreaterThanOrEqual(0)
      expect(analysis.performanceScore).toBeLessThanOrEqual(100)
    })

    it('estimates render time based on complexity', () => {
      const { result } = renderHook(() => useCompositeOptimization())
      
      const smallComposite = createMockComposite({
        internalNodes: createMockNodes(5),
        internalEdges: createMockEdges(5)
      })

      const largeComposite = createMockComposite({
        internalNodes: createMockNodes(50),
        internalEdges: createMockEdges(50)
      })

      const smallAnalysis = result.current.analyzePerformance(smallComposite)
      const largeAnalysis = result.current.analyzePerformance(largeComposite)
      
      expect(largeAnalysis.estimatedRenderTime).toBeGreaterThan(smallAnalysis.estimatedRenderTime)
    })
  })
}) 