import { CheckCircle2 } from "lucide-react"

function StatusBanner({ message, tone = "success", className = "" }) {
  if (!message) {
    return null
  }

  const isError = tone === "error"

  return (
    <div
      key={message}
      className={`animate-confirm-pop inline-flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium ${
        isError ? "bg-primary/10 text-primary" : "bg-success/10 text-ink"
      } ${className}`}
      role={isError ? "alert" : "status"}
      aria-live="polite"
    >
      {!isError ? (
        <span
          className="animate-badge-pop flex size-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-success"
          aria-hidden="true"
        >
          <CheckCircle2 size={14} strokeWidth={2.4} />
        </span>
      ) : null}
      <span>{message}</span>
    </div>
  )
}

export default StatusBanner
