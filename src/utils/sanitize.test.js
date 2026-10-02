import { sanitizePlainText } from './sanitize'

describe('sanitizePlainText', () => {
  it('removes html tags', () => {
    expect(sanitizePlainText('<b>Headline</b>')).toBe('Headline')
  })

  it('removes dangerous protocols and angle brackets', () => {
    const sanitized = sanitizePlainText('javascript:alert(1) <img src=x> data:text/html,boom')
    expect(sanitized).toContain('alert(1)')
    expect(sanitized).not.toContain('javascript:')
    expect(sanitized).not.toContain('data:')
    expect(sanitized).not.toMatch(/[<>]/)
  })
})
