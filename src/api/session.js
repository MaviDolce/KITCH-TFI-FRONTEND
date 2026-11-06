import { STORAGE_KEYS } from "../constants/storage"

const UNAUTHORIZED_EVENT = "kitch:unauthorized"

export function getToken() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.token)
    return raw || null
  } catch {
    return null
  }
}

export function getExpiresAt() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.tokenExpires)
    return raw || null
  } catch {
    return null
  }
}

export function setSessionToken(token, expiresAt) {
  window.localStorage.setItem(STORAGE_KEYS.token, token)
  if (expiresAt) {
    window.localStorage.setItem(STORAGE_KEYS.tokenExpires, expiresAt)
  } else {
    window.localStorage.removeItem(STORAGE_KEYS.tokenExpires)
  }
}

export function clearSessionToken() {
  window.localStorage.removeItem(STORAGE_KEYS.token)
  window.localStorage.removeItem(STORAGE_KEYS.tokenExpires)
}

export function notifyUnauthorized() {
  window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
}

export function onUnauthorized(handler) {
  window.addEventListener(UNAUTHORIZED_EVENT, handler)
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler)
}

export function getPendingTwoFactor() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.pendingTwoFactor)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setPendingTwoFactor(payload) {
  if (!payload) {
    window.sessionStorage.removeItem(STORAGE_KEYS.pendingTwoFactor)
    return
  }
  window.sessionStorage.setItem(STORAGE_KEYS.pendingTwoFactor, JSON.stringify(payload))
}
