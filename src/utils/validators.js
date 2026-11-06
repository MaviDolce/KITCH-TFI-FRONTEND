export const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isUsername(value) {
  const trimmed = value.trim()
  return trimmed.length >= 3 && trimmed.length <= 50 && USERNAME_PATTERN.test(trimmed)
}
