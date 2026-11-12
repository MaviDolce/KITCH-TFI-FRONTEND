import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getToken, onUnauthorized } from "../api/session"
import { authService } from "../services/authService"
import { AuthContext } from "./auth-context"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [pendingTwoFactor, setPendingTwoFactor] = useState(authService.getPendingTwoFactor)
  const [ready, setReady] = useState(false)
  const [hydrationError, setHydrationError] = useState(null)
  const activeRef = useRef(true)

  const hydrate = useCallback(async () => {
    if (!getToken()) {
      setHydrationError(null)
      setReady(true)
      return
    }
    setReady(false)
    try {
      const perfil = await authService.getMe()
      if (activeRef.current) {
        setUser(perfil)
        setHydrationError(null)
      }
    } catch (error) {
      if (!activeRef.current) {
        return
      }
      if (error?.status === 401) {
        authService.logout()
        setUser(null)
        setHydrationError(null)
      } else {
        setHydrationError(error)
      }
    } finally {
      if (activeRef.current) {
        setReady(true)
      }
    }
  }, [])

  useEffect(() => {
    activeRef.current = true
    hydrate()
    return () => {
      activeRef.current = false
    }
  }, [hydrate])

  useEffect(() => {
    return onUnauthorized(() => {
      setUser(null)
      setPendingTwoFactor(null)
      setHydrationError(null)
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      pendingTwoFactor,
      ready,
      hydrationError,
      isAuthenticated: Boolean(user),
      retryHydration: hydrate,
      async login(credentials) {
        const result = await authService.login(credentials)
        setPendingTwoFactor(authService.getPendingTwoFactor())
        return result
      },
      async verifyTwoFactor(code) {
        const session = await authService.verifyTwoFactor(code)
        setPendingTwoFactor(null)
        setUser(session)
        return session
      },
      async resendTwoFactor() {
        const result = await authService.resendTwoFactor()
        setPendingTwoFactor(authService.getPendingTwoFactor())
        return result
      },
      async register(payload) {
        const result = await authService.register(payload)
        setPendingTwoFactor(authService.getPendingTwoFactor())
        return result
      },
      forgotPassword: (email) => authService.forgotPassword(email),
      resetPassword: (payload) => authService.resetPassword(payload),
      changePassword: (payload) => authService.changePassword(payload),
      async refreshSession() {
        const session = await authService.refreshSession()
        setUser(session)
        return session
      },
      async reloadProfile() {
        const session = await authService.getMe()
        setUser(session)
        return session
      },
      logout() {
        authService.logout()
        setUser(null)
        setPendingTwoFactor(null)
        setHydrationError(null)
      },
      async updateProfile(payload) {
        const session = await authService.updateMe(payload)
        setUser(session)
        return session
      },
    }),
    [hydrate, hydrationError, pendingTwoFactor, ready, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
