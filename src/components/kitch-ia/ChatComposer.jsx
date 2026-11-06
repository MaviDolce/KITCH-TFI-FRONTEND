import { ArrowUp } from "lucide-react"

function ChatComposer({ value, onChange, onSubmit, disabled }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(value)
  }

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <label htmlFor="kitch-ia-mensaje" className="sr-only">
        Pregúntale algo a Kitch
      </label>
      <input
        id="kitch-ia-mensaje"
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Pregúntale algo a Kitch..."
        autoComplete="off"
        className="h-14 w-full rounded-full border border-line bg-surface pr-16 pl-5 text-base text-ink placeholder:text-muted/80 shadow-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Enviar mensaje"
        className="absolute top-1/2 right-1.5 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowUp size={18} strokeWidth={2.4} />
      </button>
    </form>
  )
}

export default ChatComposer
