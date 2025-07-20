# onAimFlow

A modern React-based workflow builder with drag-and-drop functionality, built with React Flow, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Drag & Drop Interface** - Intuitive node creation from sidebar palette
- 🔗 **Visual Connections** - Connect nodes with smooth, animated edges
- 🌓 **Dark/Light Mode** - Theme support with system preference detection
- 💾 **Auto-save** - Workflow persists to localStorage automatically
- 🎯 **TypeScript** - Full type safety throughout the application
- ⚡ **Performance Optimized** - Memoized components and efficient rendering

## Tech Stack

- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development experience
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **React Flow** - Powerful library for building node-based UIs
- **Vite** - Fast build tool and development server

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   ├── CanvasContainer.tsx
│   ├── CustomNode.tsx
│   ├── FlowCanvas.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── NodePalette.tsx
│   └── ThemeProvider.tsx
├── hooks/           # Custom React hooks
│   └── useFlowData.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Usage

1. **Create Nodes**: Drag node types from the left sidebar onto the canvas
2. **Connect Nodes**: Drag from the output handle (right) to input handle (left) of another node
3. **Move Nodes**: Click and drag nodes to reposition them
4. **Clear Workflow**: Use the "Clear Flow" button to reset the canvas
5. **Toggle Theme**: Click the theme toggle button in the header

## Node Types

- **EVENT** (⚡) - Trigger events and actions
- **FILTER** (🔍) - Filter and validate data
- **SELECT** (📊) - Select and transform data
- **OUTPUT** (📤) - Output and export results

## Development

```bash
# Run linter
npm run lint

# Type checking
npm run build
```

## License

MIT
