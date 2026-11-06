function IconButton({
  children,
  label,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`inline-flex size-11 items-center justify-center rounded-xl text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton
