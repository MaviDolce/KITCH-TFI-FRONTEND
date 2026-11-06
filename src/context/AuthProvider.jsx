import { useEffect, useMemo, useState } from "react"
import { getToken, onUnauthorized } from "../api/session"
import { authService } from "../services/authService"
import { AuthContext } from "./auth-context"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [pendingTwoFactor, setPendingTwoFactor] = useState(authService.getPendingTwoFactor)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true

    async function hydrate() {
      if (!getToken()) {
        if (active) {
          setReady(true)
        }
        return
      }
      try {
        const perfil = await authService.getMe()
        if (active) {
          setUser(perfil)
        }
      } catch (error) {
        if (active && error?.status === 401) {
          authService.logout()
          setUser(null)
        }
      } finally {
        if (active) {
          setReady(true)
        }
      }
    }

    hydrate()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    return onUnauthorized(() => {
      setUser(null)
      setPendingTwoFactor(null)
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      pendingTwoFactor,
      ready,
      isAuthenticated: Boolean(user),
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
      async register(payload) {
        const session = await authService.register(payload)
        setPendingTwoFactor(null)
        setUser(session)
        return session
      },
      forgotPassword: (email) => authService.forgotPassword(email),
      resetPassword: (payload) => authService.resetPassword(payload),
      logout() {
        authService.logout()
        setUser(null)
        setPendingTwoFactor(null)
      },
      async updateProfile(payload) {
        const session = await authService.updateMe(payload)
        setUser(session)
        return session
      },
    }),
    [pendingTwoFactor, ready, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
