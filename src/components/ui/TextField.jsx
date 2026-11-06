import { useId, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import IconButton from "./IconButton"

function TextField({
  id,
  label,
  type = "text",
  error,
  hint,
  labelEnd,
  className = "",
  disabled = false,
  ...props
}) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label ? (
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={fieldId} className="text-sm font-semibold text-ink">
            {label}
          </label>
          {labelEnd}
        </div>
      ) : null}

      <div className="relative">
        <input
          id={fieldId}
          type={inputType}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`h-12 w-full rounded-2xl border bg-surface px-4 text-base text-ink placeholder:text-muted/70 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-canvas disabled:opacity-60 ${
            isPassword ? "pr-12" : ""
          } ${error ? "border-primary" : "border-line"}`}
          {...props}
        />

        {isPassword ? (
          <span className="absolute inset-y-0 right-1 flex items-center">
            <IconButton
              label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </IconButton>
          </span>
        ) : null}
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

export default TextField
