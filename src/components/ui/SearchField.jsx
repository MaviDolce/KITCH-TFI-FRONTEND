import { useId } from "react"
import { Search } from "lucide-react"

function SearchField({
  id,
  label = "Buscar recetas o ingredientes",
  className = "",
  ...props
}) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={fieldId} className="sr-only">
        {label}
      </label>
      <Search
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
      />
      <input
        id={fieldId}
        type="search"
        placeholder={label}
        className="h-14 w-full rounded-full border border-line bg-surface pr-4 pl-11 text-base text-ink placeholder:text-muted/80 shadow-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        {...props}
      />
    </div>
  )
}

export default SearchField
