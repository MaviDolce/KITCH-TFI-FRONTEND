import Spinner from "./Spinner"

function PageLoader({ label = "Cargando" }) {
  return (
    <div
      className="flex min-h-svh items-center justify-center bg-canvas"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Spinner size={28} className="text-primary" />
    </div>
  )
}

export default PageLoader
