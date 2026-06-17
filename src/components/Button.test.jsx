import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen, userEvent } from '../test/utils'
import Button from './Button'

describe('Button Component', () => {
  it('renders button with correct text', () => {
    renderWithProviders(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    renderWithProviders(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByText('Click me')
    await userEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('disables button when disabled prop is true', () => {
    renderWithProviders(<Button disabled>Click me</Button>)
    
    const button = screen.getByText('Click me')
    expect(button).toBeDisabled()
  })

  it('applies correct styling classes', () => {
    const { container } = renderWithProviders(
      <Button className="custom-class">Click me</Button>
    )
    
    const button = container.querySelector('button')
    expect(button).toHaveClass('custom-class')
  })

  it('renders children correctly', () => {
    renderWithProviders(
      <Button>
        <span>Child Element</span>
      </Button>
    )
    
    expect(screen.getByText('Child Element')).toBeInTheDocument()
  })
})
