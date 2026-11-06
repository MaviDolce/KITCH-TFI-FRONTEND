import { Clock, Sparkles } from "lucide-react"
import Card from "../ui/Card"
import { CHAT_SUGGESTIONS } from "../../constants/chatSuggestions"

const ICONS = {
  alacena: Sparkles,
  rapida: Clock,
}

const TONES = {
  primary: "text-primary",
  success: "text-success",
}

function SuggestionCards({ onSelect }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {CHAT_SUGGESTIONS.map((item) => {
        const Icon = ICONS[item.id]
        return (
          <Card
            as="button"
            type="button"
            key={item.id}
            padding={false}
            className="w-full cursor-pointer p-5 text-left transition-colors duration-150 hover:bg-ai focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => onSelect(item.label)}
          >
            <Icon size={22} className={TONES[item.tone]} aria-hidden="true" />
            <p className="mt-3 text-base font-semibold text-ink">{item.label}</p>
          </Card>
        )
      })}
    </div>
  )
}

export default SuggestionCards
