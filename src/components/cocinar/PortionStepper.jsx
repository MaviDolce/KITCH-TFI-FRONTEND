import { Minus, Plus } from "lucide-react"
import IconButton from "../ui/IconButton"

function PortionStepper({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <IconButton
        label="Menos porciones"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
      >
        <Minus size={16} />
      </IconButton>
      <p className="min-w-10 text-center text-lg font-bold text-ink">{value}</p>
      <IconButton label="Más porciones" onClick={() => onChange(value + 1)}>
        <Plus size={16} />
      </IconButton>
    </div>
  )
}

export default PortionStepper
