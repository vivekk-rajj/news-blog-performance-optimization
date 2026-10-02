import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Performance Optimization interface', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders an accessible primary interface and supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /performance optimization/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/initiative/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/owner/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/impact score/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /save optimization/i }),
    ).toBeInTheDocument()

    await user.tab()
    expect(screen.getByLabelText(/initiative/i)).toHaveFocus()
    await user.tab()
    expect(screen.getByLabelText(/owner/i)).toHaveFocus()
  })

  it('shows an empty state when there is no data', () => {
    render(<App />)

    expect(screen.getByText(/no data found/i)).toBeInTheDocument()
  })

  it('blocks invalid submissions and marks offending fields accessibly', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /save optimization/i }))

    expect(screen.getByText(/initiative is required/i)).toBeInTheDocument()
    expect(screen.getByText(/owner is required/i)).toBeInTheDocument()
    expect(
      screen.getByText(/impact score must be a number between 1 and 100/i),
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/initiative/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/owner/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/impact score/i)).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  it('shows a loading indicator during async work and logs telemetry on completion', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/initiative/i), 'Image compression rollout')
    await user.type(screen.getByLabelText(/owner/i), 'Platform Team')
    await user.type(screen.getByLabelText(/impact score/i), '92')
    await user.click(screen.getByRole('button', { name: /save optimization/i }))

    expect(screen.getByRole('status')).toHaveTextContent(/loading/i)

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    expect(screen.getByText(/image compression rollout/i)).toBeInTheDocument()
    expect(console.log).toHaveBeenCalledWith(
      '[Analytics] User interacted with Performance Optimization',
    )
  })

  it('sanitizes text input before storing data and supports responsive filtering', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/initiative/i), '<script>alert(1)</script>')
    await user.type(screen.getByLabelText(/owner/i), 'Jane <b>Doe</b>')
    await user.type(screen.getByLabelText(/impact score/i), '40')
    await user.click(screen.getByRole('button', { name: /save optimization/i }))

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    const sanitizedInitiative = screen.getByText(/alert\(1\)/i)
    expect(sanitizedInitiative.textContent).not.toContain('<')
    expect(sanitizedInitiative.textContent).not.toContain('>')

    await user.type(screen.getByLabelText(/search optimizations/i), 'alert')
    expect(screen.getByText(/alert\(1\)/i)).toBeInTheDocument()
    expect(screen.getByText(/no data found/i)).not.toBeInTheDocument()
  })
})
