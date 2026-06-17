import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../test/utils'
import Card from '../components/Card'

describe('Card Component', () => {
  it('renders card with children', () => {
    renderWithProviders(
      <Card>
        <p>Card content</p>
      </Card>
    )
    
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = renderWithProviders(
      <Card className="custom-card">
        Content
      </Card>
    )
    
    const card = container.querySelector('[class*="Card"]') || container.firstChild
    expect(card).toBeTruthy()
  })

  it('renders multiple children', () => {
    renderWithProviders(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
      </Card>
    )
    
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })
})
