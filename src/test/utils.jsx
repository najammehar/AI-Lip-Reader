import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Custom render function that wraps components with necessary providers
export function renderWithProviders(
  ui,
  {
    ...renderOptions
  } = {}
) {
  return render(ui, { ...renderOptions })
}

export { render, screen, waitFor, within, userEvent }
