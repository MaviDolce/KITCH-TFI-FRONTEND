import { ChefHat } from "lucide-react"

const SIZES = {
  sm: { wrap: "size-10 rounded-2xl", icon: 20, text: "text-lg" },
  md: { wrap: "size-11 rounded-2xl", icon: 22, text: "text-xl" },
  lg: { wrap: "size-14 rounded-3xl", icon: 28, text: "text-3xl" },
}

function Logo({ size = "md", withWordmark = true, className = "" }) {
  const styles = SIZES[size]

  return (
    <span className={`inline-flex items-center gap-2.5 text-ink ${className}`}>
      <span
        className={`flex items-center justify-center bg-primary text-white ${styles.wrap}`}
      >
        <ChefHat aria-hidden="true" size={styles.icon} strokeWidth={2.25} />
      </span>
      {withWordmark ? (
        <span className={`font-bold tracking-tight ${styles.text}`}>Kitch</span>
      ) : (
        <span className="sr-only">Kitch</span>
      )}
    </span>
  )
}

export default Logo
