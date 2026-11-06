import axios from "axios"
import { toApiError } from "./errors"
import { clearSessionToken, getToken, notifyUnauthorized } from "./session"

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  throw new Error("Falta VITE_API_BASE_URL en el entorno.")
}

export const http = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error)
    if (apiError.status === 401 && getToken()) {
      clearSessionToken()
      notifyUnauthorized()
    }
    return Promise.reject(apiError)
  },
)
