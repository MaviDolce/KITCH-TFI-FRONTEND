export const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/

export const PASSWORD_MIN_LENGTH = 8

export function isValidPassword(value) {
  return typeof value === "string" && value.length >= PASSWORD_MIN_LENGTH
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isUsername(value) {
  const trimmed = value.trim()
  return trimmed.length >= 3 && trimmed.length <= 50 && USERNAME_PATTERN.test(trimmed)
}
