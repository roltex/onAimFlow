/**
 * Available node types in the workflow
 */
export type NodeTypeEnum = 'event' | 'filter' | 'select' | 'output'

/**
 * Port type for dynamic nodes (connection points)
 */
export type PortType = 'input' | 'output' | 'input/output'

/**
 * Port definition for dynamic nodes (connection points/edges)
 */
export interface PortDefinition {
  id: string
  name: string
  type: PortType // 'input' = incoming edge, 'output' = outgoing edge, 'input/output' = both
  description?: string
  required?: boolean
}

/**
 * Field type for configurable fields
 */
export type FieldType = 'text' | 'number' | 'select' | 'textarea' | 'boolean' | 'date'

/**
 * Select option for field configuration
 */
export interface SelectOption {
  value: string
  label: string
}

/**
 * Configurable field definition
 */
export interface ConfigurableField {
  id: string
  name: string
  type: FieldType
  description?: string
  required?: boolean
  defaultValue?: any
  options?: SelectOption[] // For select type fields
  placeholder?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    custom?: string
  }
}

/**
 * Dynamic node type definition
 */
export interface DynamicNodeType {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  ports: PortDefinition[]
  fields: ConfigurableField[]
  createdAt: Date
  updatedAt: Date
  isCustom: boolean
}

/**
 * Node type definition for the palette
 */
export interface NodeType {
  id: string
  type: NodeTypeEnum
  label: string
  description: string
  icon: string
  color: string
  category?: string
}

/**
 * Extended node type that includes dynamic types
 */
export type ExtendedNodeType = NodeType | DynamicNodeType

/**
 * Event source options for EVENT nodes
 */
export type EventSource = 'Hub' | 'Leaderboard' | 'External'

/**
 * Event type options based on source
 */
export interface EventTypeOptions {
  Hub: ['Bet', 'Win']
  Leaderboard: ['PositionChange', 'TakeWinnigPlace']
  External: ['Deposit', 'Bet', 'Login']
}

/**
 * Conditional operators for FILTER nodes
 */
export type ConditionalOperator = 'equals' | 'not equals' | 'greater than' | 'less than'

/**
 * Filter condition structure
 */
export interface FilterCondition {
  id: string
  propertyName: string
  operator: ConditionalOperator
  value: string
}

/**
 * Output step structure
 */
export interface OutputStep {
  id: string
  progress: number
  point: number
}

/**
 * Data structure for custom nodes in the flow
 */
export interface CustomNodeData {
  label: string
  description: string
  icon: string
  nodeType?: NodeTypeEnum | string // string for dynamic node types
  color?: string
  // Dynamic node type ID (for custom nodes)
  dynamicNodeTypeId?: string
  // Dynamic node field values
  dynamicFieldValues?: Record<string, any>
  // EVENT node specific data
  eventSource?: EventSource
  eventType?: string
  // FILTER node specific data
  filterConditions?: FilterCondition[]
  // SELECT node specific data
  selectProperty?: string
  // OUTPUT node specific data
  outputSteps?: OutputStep[]
}

/**
 * Flow validation result
 */
export interface FlowValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

/**
 * Flow validation error types
 */
export type FlowValidationError = 
  | 'NO_EVENT_NODE'
  | 'NO_OUTPUT_NODE' 
  | 'DISCONNECTED_NODES'
  | 'NO_PATH_EVENT_TO_OUTPUT'
  | 'INVALID_NODE_CONFIG'

/**
 * Flow metadata for dashboard management
 */
export interface Flow {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  nodeCount: number
  edgeCount: number
  published: boolean
} 