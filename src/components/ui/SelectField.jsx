import { useId } from "react"
import { ChevronDown } from "lucide-react"

function SelectField({
  id,
  label,
  error,
  hint,
  className = "",
  disabled = false,
  children,
  ...props
}) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label ? (
        <label htmlFor={fieldId} className="text-sm font-semibold text-ink">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <select
          id={fieldId}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`h-12 w-full appearance-none rounded-2xl border bg-surface px-4 pr-11 text-base text-ink transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-canvas disabled:opacity-60 ${
            error ? "border-primary" : "border-line"
          }`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted"
        />
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}

      {!error && hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export default SelectField
