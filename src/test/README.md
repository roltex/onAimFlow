# Testing Guide for onAimFlow

This document provides comprehensive guidance for testing the onAimFlow application using Vitest and React Testing Library.

## 🧪 Testing Setup

### Dependencies
- **Vitest**: Fast unit testing framework for Vite
- **React Testing Library**: Testing utilities for React components
- **Jest DOM**: Custom matchers for DOM testing
- **User Event**: Simulate user interactions
- **JSDOM**: DOM environment for Node.js

### Configuration Files
- `vite.config.ts`: Vitest configuration with JSDOM environment
- `src/test/setup.ts`: Global test setup and mocks
- `package.json`: Test scripts and dependencies

## 🚀 Available Test Scripts

```bash
# Run tests in watch mode (development)
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI (if @vitest/ui is installed)
npm run test:ui
```

## 📁 Test Structure

```
src/test/
├── setup.ts                    # Global test setup
├── README.md                   # This documentation
├── components/                 # Component tests
│   └── IconRenderer.test.tsx   # IconRenderer component tests
└── utils/                      # Utility function tests
    └── flowValidation.test.ts  # Flow validation tests
```

## 🧩 Component Testing

### Example: IconRenderer Component Test

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IconRenderer } from '../../components/IconRenderer'

describe('IconRenderer', () => {
  it('renders emoji icons correctly', () => {
    render(<IconRenderer icon="🚀" className="text-2xl" />)
    const iconElement = screen.getByText('🚀')
    expect(iconElement).toBeInTheDocument()
    expect(iconElement).toHaveClass('text-2xl')
  })

  it('renders React Icons correctly', () => {
    render(<IconRenderer icon="FiHome" className="text-xl" />)
    const iconElement = document.querySelector('svg')
    expect(iconElement).toBeInTheDocument()
    expect(iconElement).toHaveClass('text-xl')
  })
})
```

### Testing Best Practices

1. **Test Structure**: Use `describe` blocks to group related tests
2. **Test Names**: Use descriptive test names that explain the expected behavior
3. **Arrange-Act-Assert**: Structure tests with clear sections
4. **Accessibility**: Test components as users would interact with them
5. **Mocking**: Mock external dependencies and browser APIs

## 🔧 Utility Testing

### Example: Flow Validation Test

```typescript
import { describe, it, expect } from 'vitest'
import type { Flow, Node, Edge, FlowValidationResult } from '../../types'

const mockValidateFlow = (flow: Flow, nodes: Node[], edges: Edge[]): FlowValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!nodes || nodes.length === 0) {
    errors.push('Flow must contain at least one node')
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
})
```

## 🎯 Testing Patterns

### 1. Component Testing Patterns

#### Testing Props
```typescript
it('applies custom className', () => {
  render(<Component className="custom-class" />)
  const element = screen.getByRole('button')
  expect(element).toHaveClass('custom-class')
})
```

#### Testing User Interactions
```typescript
import userEvent from '@testing-library/user-event'

it('handles click events', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  
  render(<Button onClick={handleClick}>Click me</Button>)
  const button = screen.getByRole('button')
  
  await user.click(button)
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

#### Testing Async Operations
```typescript
it('loads data asynchronously', async () => {
  render(<DataComponent />)
  
  // Wait for loading to complete
  await screen.findByText('Loaded Data')
  
  expect(screen.getByText('Loaded Data')).toBeInTheDocument()
})
```

### 2. Context Testing

#### Testing with Providers
```typescript
import { ThemeProvider } from '../ThemeProvider'
import { FlowManagerProvider } from '../contexts/FlowManagerContext'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <FlowManagerProvider>
        {component}
      </FlowManagerProvider>
    </ThemeProvider>
  )
}

it('works with context providers', () => {
  renderWithProviders(<MyComponent />)
  // Test component behavior
})
```

### 3. Mock Testing

#### Mocking Functions
```typescript
import { vi } from 'vitest'

const mockFunction = vi.fn()
mockFunction.mockReturnValue('mocked value')

it('calls mocked function', () => {
  const result = mockFunction()
  expect(result).toBe('mocked value')
  expect(mockFunction).toHaveBeenCalledTimes(1)
})
```

#### Mocking Modules
```typescript
vi.mock('../utils/api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mocked' }))
}))
```

## 🔍 Available Queries

### React Testing Library Queries

#### By Role (Recommended)
```typescript
screen.getByRole('button')
screen.getByRole('textbox')
screen.getByRole('checkbox')
screen.getByRole('radio')
screen.getByRole('combobox')
```

#### By Label
```typescript
screen.getByLabelText('Username')
screen.getByLabelText('Password')
```

#### By Text
```typescript
screen.getByText('Submit')
screen.getByText(/regex pattern/)
```

#### By Test ID (Use sparingly)
```typescript
screen.getByTestId('submit-button')
```

### Custom Queries
```typescript
// Query by CSS selector
document.querySelector('.custom-class')

// Query by attribute
screen.getByDisplayValue('input value')
```

## 🎨 Testing with Styling

### CSS-in-JS Testing
```typescript
it('applies correct styles', () => {
  render(<StyledComponent />)
  const element = screen.getByRole('button')
  
  // Test computed styles
  const styles = window.getComputedStyle(element)
  expect(styles.backgroundColor).toBe('rgb(59, 130, 246)')
})
```

### Theme Testing
```typescript
it('applies theme styles', () => {
  render(
    <ThemeProvider>
      <ThemedComponent />
    </ThemeProvider>
  )
  
  const element = screen.getByRole('button')
  expect(element).toHaveClass('dark:bg-gray-800')
})
```

## 📊 Coverage Testing

### Running Coverage
```bash
npm run test:coverage
```

### Coverage Configuration
Coverage is configured in `vite.config.ts`:
- **Provider**: V8 (fast and reliable)
- **Reporters**: Text, JSON, HTML
- **Exclusions**: node_modules, test files, config files

### Coverage Goals
- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

## 🐛 Debugging Tests

### Debug Mode
```typescript
it('debug test', () => {
  render(<Component />)
  screen.debug() // Prints DOM structure
})
```

### Debug Specific Elements
```typescript
it('debug element', () => {
  render(<Component />)
  const element = screen.getByRole('button')
  screen.debug(element) // Prints specific element
})
```

### Using Browser DevTools
```typescript
it('debug in browser', () => {
  render(<Component />)
  // This will pause execution and open browser
  debugger
})
```

## 🚨 Common Issues and Solutions

### 1. Async Testing
```typescript
// ❌ Wrong
it('async test', () => {
  render(<AsyncComponent />)
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// ✅ Correct
it('async test', async () => {
  render(<AsyncComponent />)
  await screen.findByText('Loaded')
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### 2. Event Handling
```typescript
// ❌ Wrong
it('click test', () => {
  render(<Button onClick={handleClick} />)
  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalled()
})

// ✅ Correct
it('click test', async () => {
  const user = userEvent.setup()
  render(<Button onClick={handleClick} />)
  await user.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalled()
})
```

### 3. Context Testing
```typescript
// ❌ Wrong
it('context test', () => {
  render(<Component />) // Missing provider
  // Test will fail
})

// ✅ Correct
it('context test', () => {
  render(
    <ContextProvider>
      <Component />
    </ContextProvider>
  )
  // Test will work
})
```

## 📝 Writing New Tests

### 1. Component Test Template
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentName } from '../ComponentName'

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    const user = userEvent.setup()
    render(<ComponentName />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    // Assert expected behavior
  })

  it('applies props correctly', () => {
    render(<ComponentName className="custom" />)
    expect(screen.getByRole('button')).toHaveClass('custom')
  })
})
```

### 2. Utility Test Template
```typescript
import { describe, it, expect } from 'vitest'
import { utilityFunction } from '../utils/utilityFunction'

describe('utilityFunction', () => {
  it('handles valid input', () => {
    const result = utilityFunction('valid input')
    expect(result).toBe('expected output')
  })

  it('handles invalid input', () => {
    expect(() => utilityFunction('')).toThrow('Invalid input')
  })

  it('handles edge cases', () => {
    const result = utilityFunction(null)
    expect(result).toBe('default value')
  })
})
```

## 🎯 Best Practices Summary

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Semantic Queries**: Prefer `getByRole` over `getByTestId`
3. **Test Accessibility**: Ensure components work with screen readers and keyboard navigation
4. **Keep Tests Simple**: Each test should verify one specific behavior
5. **Use Descriptive Names**: Test names should explain the expected behavior
6. **Mock External Dependencies**: Don't test third-party libraries
7. **Test Error States**: Ensure components handle errors gracefully
8. **Use Setup Functions**: Create reusable test utilities for common patterns

## 🔗 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event Documentation](https://testing-library.com/docs/user-event/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) 