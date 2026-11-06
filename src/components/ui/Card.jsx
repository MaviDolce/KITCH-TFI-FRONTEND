const TONES = {
  surface: "bg-surface",
  ai: "bg-ai",
}

function Card({
  as: Component = "div",
  tone = "surface",
  padding = true,
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`rounded-3xl shadow-[0_8px_24px_rgb(21_25_30_/_0.06)] ${TONES[tone]} ${padding ? "p-6" : ""} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
