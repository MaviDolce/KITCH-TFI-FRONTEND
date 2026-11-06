import { Link } from "react-router-dom"
import Spinner from "./Spinner"

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary/90 disabled:hover:bg-primary",
  outline:
    "border border-line bg-surface text-ink hover:bg-canvas disabled:hover:bg-surface",
  soft: "bg-surface text-primary hover:bg-white disabled:hover:bg-surface",
  accent: "bg-accent text-ink hover:bg-accent/90 disabled:hover:bg-accent",
  ghost: "bg-transparent text-primary hover:bg-primary/10 disabled:hover:bg-transparent",
}

const SIZES = {
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
}

function Button({
  children,
  variant = "primary",
  size = "lg",
  type = "button",
  to,
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const isDisabled = disabled || loading
  const classes = `inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${isDisabled && to ? "pointer-events-none cursor-not-allowed opacity-50" : ""} ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  const content = (
    <>
      {loading ? <Spinner size={16} /> : null}
      {children}
    </>
  )

  if (to) {
    if (isDisabled) {
      return (
        <span className={classes} aria-disabled="true" role="link">
          {content}
        </span>
      )
    }

    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {content}
    </button>
  )
}

export default Button
