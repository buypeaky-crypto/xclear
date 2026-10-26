export const USER_RE = /^[A-Za-z0-9_]{1,15}$/

export function sanitizeUsername(input: string): string {
  if (!input) return ''
  return input
    .trim()
    .replace(/^@+/, '')
    .replace(/^https?:\/\/(www\.)?(x\.com|twitter\.com|tiktok\.com|instagram\.com|youtube\.com)\//i, '')
    .replace(/^@/, '')
    .split('/')[0]
    .split('?')[0]
    .split('#')[0]
    .split(' ')[0]
    .trim()
    .toLowerCase()
}

export function validateUsername(input: string): { valid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeUsername(input)
  if (!sanitized) return { valid: false, sanitized, error: 'Enter a username' }
  if (sanitized.length > 15) return { valid: false, sanitized, error: 'Max 15 characters' }
  if (!USER_RE.test(sanitized)) return { valid: false, sanitized, error: 'Only letters, numbers, underscore allowed' }
  return { valid: true, sanitized }
}
