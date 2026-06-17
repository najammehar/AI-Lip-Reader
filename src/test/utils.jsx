import { render } from '@testing-library/react'

// Custom render function that wraps components with necessary providers
export function renderWithProviders(
  ui,
  {
    ...renderOptions
  } = {}
) {
  return render(ui, { ...renderOptions })
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
