import { ChevronLeft, ChevronRight } from "lucide-react"
import IconButton from "../ui/IconButton"
import { formatWeekRange } from "../../utils/week"

function WeekNav({ monday, onPrev, onNext }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <IconButton label="Semana anterior" onClick={onPrev}>
        <ChevronLeft size={20} />
      </IconButton>
      <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-ink sm:text-base">
        {formatWeekRange(monday)}
      </p>
      <IconButton label="Semana siguiente" onClick={onNext}>
        <ChevronRight size={20} />
      </IconButton>
    </div>
  )
}

export default WeekNav
