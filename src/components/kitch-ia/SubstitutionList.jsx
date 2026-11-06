import { CheckCircle2 } from "lucide-react"
import Card from "../ui/Card"

function SubstitutionList({ ingrediente, sustitutos }) {
  return (
    <Card className="max-w-xl">
      <p className="text-sm font-semibold text-primary">
        Reemplazos para {ingrediente}
      </p>
      <ul className="mt-3 space-y-3">
        {sustitutos.map((item) => (
          <li key={item.ingredienteId} className="flex items-start gap-3">
            <CheckCircle2
              size={18}
              className={item.disponibleEnAlacena ? "text-success" : "text-muted"}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-ink">{item.nombre}</p>
              {item.notas ? <p className="mt-0.5 text-sm text-muted">{item.notas}</p> : null}
              <p className="mt-1 text-xs font-medium text-primary">
                {item.disponibleEnAlacena ? "Lo tenés en tu alacena" : "No está en tu alacena"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default SubstitutionList
