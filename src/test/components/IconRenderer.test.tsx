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

  it('applies custom className', () => {
    render(<IconRenderer icon="🎯" className="custom-class" />)
    const iconElement = screen.getByText('🎯')
    expect(iconElement).toHaveClass('custom-class')
  })

  it('handles unknown React Icons gracefully', () => {
    render(<IconRenderer icon="UnknownIcon" className="text-lg" />)
    const iconElement = screen.getByText('UnknownIcon')
    expect(iconElement).toBeInTheDocument()
  })
}) 