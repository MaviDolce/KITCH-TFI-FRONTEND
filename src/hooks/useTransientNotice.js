import { useCallback, useEffect, useRef, useState } from "react"

const DEFAULT_DURATION_MS = 3500

export function useTransientNotice(duration = DEFAULT_DURATION_MS) {
  const [notice, setNotice] = useState("")
  const timerRef = useRef(null)

  const show = useCallback(
    (message) => {
      window.clearTimeout(timerRef.current)
      setNotice(message || "")
      if (message) {
        timerRef.current = window.setTimeout(() => setNotice(""), duration)
      }
    },
    [duration],
  )

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  return [notice, show]
}
