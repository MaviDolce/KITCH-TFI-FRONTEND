import { useEffect, useRef, useState } from "react"
import { Sparkles } from "lucide-react"
import AssistantMessage from "../../components/kitch-ia/AssistantMessage"
import ChatComposer from "../../components/kitch-ia/ChatComposer"
import SuggestionCards from "../../components/kitch-ia/SuggestionCards"
import UserMessage from "../../components/kitch-ia/UserMessage"
import Spinner from "../../components/ui/Spinner"
import { favoritosService } from "../../services/favoritosService"
import { chatIaService } from "../../services/chatIaService"

function nextId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function KitchIaPage() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const [recetaActual, setRecetaActual] = useState(null)
  const [favorites, setFavorites] = useState([])
  const bottomRef = useRef(null)

  const empty = messages.length === 0

  useEffect(() => {
    favoritosService.listIds().then(setFavorites).catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" })
  }, [messages, sending])

  async function send(text) {
    const mensaje = String(text ?? "").trim()
    if (!mensaje || sending) {
      return
    }

    setDraft("")
    setMessages((current) => [...current, { id: nextId(), rol: "usuario", texto: mensaje }])
    setSending(true)

    try {
      const historial = messages.map((item) => ({
        rol: item.rol,
        texto: item.texto ?? item.mensaje ?? "",
      }))
      const respuesta = await chatIaService.enviar({
        mensaje,
        historial,
        recetaActual,
      })
      if (respuesta.receta) {
        setRecetaActual(respuesta.receta)
      }
      const ids = await favoritosService.listIds().catch(() => favorites)
      setFavorites(ids)
      setMessages((current) => [
        ...current,
        {
          id: nextId(),
          rol: "asistente",
          ...respuesta,
        },
      ])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: nextId(),
          rol: "asistente",
          mensaje: error.message || "No pudimos completar esa consulta.",
        },
      ])
    } finally {
      setSending(false)
    }
  }

  async function handleToggleFavorite(recetaId) {
    try {
      await favoritosService.toggle(recetaId)
      const ids = await favoritosService.listIds()
      setFavorites(ids)
    } catch {
      const ids = await favoritosService.listIds().catch(() => favorites)
      setFavorites(ids)
    }
  }

  return (
    <div className="relative isolate flex min-h-[calc(100svh-8.5rem)] flex-col overflow-x-clip lg:min-h-[calc(100svh-4rem)]">
      <div
        className="pointer-events-none absolute -top-16 right-10 size-64 rounded-full bg-success/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 -left-10 size-72 rounded-full bg-warning/20 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Kitch IA
          <Sparkles size={22} className="text-primary" aria-hidden="true" />
        </h1>
        <p className="mt-2 text-base text-muted">
          Tu asistente inteligente para cocinar mejor con lo que tenés
        </p>
      </header>

      {empty ? (
        <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-1 py-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            ¿Qué querés cocinar?
          </h2>
          <div className="mt-8 w-full text-left">
            <SuggestionCards onSelect={send} />
          </div>
        </div>
      ) : (
        <div className="relative mx-auto mt-8 flex w-full max-w-3xl flex-1 flex-col gap-6">
          {messages.map((message) =>
            message.rol === "usuario" ? (
              <UserMessage key={message.id} texto={message.texto} />
            ) : (
              <AssistantMessage
                key={message.id}
                message={message}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            ),
          )}
          {sending ? (
            <div className="flex items-center gap-2 text-sm text-muted" role="status" aria-live="polite">
              <Sparkles size={16} className="text-primary" aria-hidden="true" />
              <span>Kitch está pensando</span>
              <Spinner size={14} className="text-primary" />
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="fixed inset-x-0 bottom-[5.5rem] z-10 bg-canvas/95 px-4 pt-3 pb-2 backdrop-blur-sm lg:static lg:mt-auto lg:bg-transparent lg:px-0 lg:pt-8 lg:pb-0 lg:backdrop-blur-none">
        <div className="mx-auto w-full max-w-3xl">
          <ChatComposer
            value={draft}
            onChange={setDraft}
            onSubmit={send}
            disabled={sending}
          />
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </div>
  )
}

export default KitchIaPage
