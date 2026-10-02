import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Performance Optimization dashboard', () => {
  it('renders the dashboard and default records', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /news blog performance optimization/i })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: /search content/i })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('shows a friendly empty state when search has no matches', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('searchbox', { name: /search content/i }), 'no-match-term')

    expect(screen.getByText(/no data found/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('shows validation errors for malformed form values and blocks submission', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /add record/i }))

    const titleField = screen.getByLabelText(/content title/i)
    const scoreField = screen.getByLabelText(/performance score/i)

    expect(titleField).toHaveAttribute('aria-invalid', 'true')
    expect(scoreField).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    expect(screen.getByText(/score must be a number between 0 and 100/i)).toBeInTheDocument()
  })

  it('sanitizes input and adds a new record on valid submission', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/content title/i), '<script>alert(1)</script> News javascript:bad')
    await user.type(screen.getByLabelText(/performance score/i), '88')
    await user.click(screen.getByRole('button', { name: /add record/i }))

    const addedRecord = screen.getAllByRole('listitem')[0]
    expect(addedRecord).toHaveTextContent(/alert\(1\)/i)
    expect(addedRecord).not.toHaveTextContent(/javascript:/i)
    expect(addedRecord).not.toHaveTextContent(/[<>]/)
    expect(screen.getByText(/record added successfully/i)).toBeInTheDocument()
  })

  it('shows loading indicator for async optimization and logs analytics on success', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /optimize first matching record/i }))

    expect(screen.getByText(/optimizing record over slow network/i)).toBeInTheDocument()
    expect(await screen.findByText(/optimization completed for/i, {}, { timeout: 3000 })).toBeInTheDocument()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[Analytics] User interacted with Performance Optimization'))

    logSpy.mockRestore()
  })

  it('supports keyboard basics for controls and exposes landmarks', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()

    await user.tab()
    expect(screen.getByRole('searchbox', { name: /search content/i })).toHaveFocus()

    const actionsRegion = screen.getByRole('region', { name: /optimization actions/i })
    expect(within(actionsRegion).getByRole('button', { name: /optimize first matching record/i })).toBeInTheDocument()
  })
})
