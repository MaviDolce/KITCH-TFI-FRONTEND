import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import AddMealForm from "../../components/planificador/AddMealForm"
import WeekGrid from "../../components/planificador/WeekGrid"
import WeekNav from "../../components/planificador/WeekNav"
import Card from "../../components/ui/Card"
import Spinner from "../../components/ui/Spinner"
import { TURNOS } from "../../constants/turnos"
import {
  PlanificadorConflictError,
  planificadorService,
} from "../../services/planificadorService"
import { recetasService } from "../../services/recetasService"
import { addDays, parseDateKey, startOfWeek, toDateKey, weekDays } from "../../utils/week"

function firstEmptyTurno(meals, fecha) {
  const used = new Set(
    meals.filter((meal) => meal.fechaAsignada === fecha).map((meal) => meal.turno),
  )
  return TURNOS.find((turno) => !used.has(turno)) ?? TURNOS[1]
}

function uniqueIngredients(meals, recetas) {
  const names = new Set()
  for (const meal of meals) {
    const receta = recetas.find((item) => item.recetaId === meal.recetaId)
    for (const ingrediente of receta?.ingredientes ?? []) {
      names.add(ingrediente.nombre.toLowerCase())
    }
  }
  return names.size
}

function PlanificadorPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const recetaParam = searchParams.get("receta")
  const [monday, setMonday] = useState(() => startOfWeek(new Date()))
  const [meals, setMeals] = useState([])
  const [recetas, setRecetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuId, setMenuId] = useState(null)
  const [draft, setDraft] = useState(null)
  const [formError, setFormError] = useState("")
  const [conflict, setConflict] = useState(null)
  const [notice, setNotice] = useState("")
  const recetaFromQuery = recetaParam
    ? recetas.find((item) => String(item.recetaId) === String(recetaParam)) ?? null
    : null

  const days = useMemo(() => weekDays(monday), [monday])
  const todayKey = toDateKey(new Date())
  const queryDraft =
    !loading && recetaFromQuery && !draft
      ? {
          recetaId: recetaFromQuery.recetaId,
          fechaAsignada: todayKey,
          turno: firstEmptyTurno(meals, todayKey),
        }
      : null
  const formDraft = draft ?? queryDraft
  const queryNotice =
    !loading && recetaParam && !recetaFromQuery
      ? "No encontramos esa receta para planificar."
      : ""

  useEffect(() => {
    let active = true

    Promise.all([planificadorService.listar(), recetasService.listar()])
      .then(([list, catalogo]) => {
        if (active) {
          setMeals(list)
          setRecetas(catalogo)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!menuId) {
      return
    }
    function handlePointerDown(event) {
      if (event.target.closest("[data-meal-menu]")) {
        return
      }
      setMenuId(null)
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuId(null)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [menuId])

  const weekMeals = useMemo(() => {
    const start = toDateKey(days[0])
    const end = toDateKey(days[6])
    return meals.filter((meal) => meal.fechaAsignada >= start && meal.fechaAsignada <= end)
  }, [days, meals])

  function closeForm() {
    setDraft(null)
    setFormError("")
    setConflict(null)
    if (recetaParam) {
      setSearchParams({}, { replace: true })
    }
  }

  function handleAdd(fecha, turno) {
    setMenuId(null)
    setFormError("")
    setDraft({
      recetaId: recetaFromQuery?.recetaId ?? "",
      fechaAsignada: fecha,
      turno,
    })
  }

  function handleChange(meal) {
    setMenuId(null)
    setFormError("")
    setDraft({
      id: meal.id,
      recetaId: meal.recetaId,
      fechaAsignada: meal.fechaAsignada,
      turno: meal.turno,
    })
  }

  async function handleRemove(meal) {
    setMenuId(null)
    try {
      await planificadorService.eliminar(meal.id)
      setMeals((current) => current.filter((item) => item.id !== meal.id))
      setNotice(`Quitamos ${meal.titulo} del plan.`)
    } catch (error) {
      setNotice(error.message)
    }
  }

  async function handleSubmit(payload) {
    setFormError("")
    setConflict(null)
    try {
      if (payload.id) {
        const updated = await planificadorService.actualizar(payload.id, payload)
        if (updated) {
          const receta = recetas.find((item) => item.recetaId === updated.recetaId)
          setMeals((current) =>
            current.map((item) =>
              item.id === updated.id
                ? { ...item, ...updated, titulo: receta?.titulo ?? item.titulo }
                : item,
            ),
          )
          setNotice("Actualizamos esa comida.")
        }
      } else {
        const resultado = await planificadorService.crear(payload)
        if (resultado.reemplazoRealizado) {
          setMeals(await planificadorService.listar())
        } else {
          setMeals((current) => [...current, resultado.comida])
        }
        setNotice(
          [
            resultado.reemplazoRealizado
              ? `Reemplazamos la comida por ${resultado.comida.titulo}.`
              : `Planificamos ${resultado.comida.titulo}.`,
            resultado.mensajeLista,
          ]
            .filter(Boolean)
            .join(" "),
        )
      }
      closeForm()
      setMonday(startOfWeek(parseDateKey(payload.fechaAsignada)))
    } catch (error) {
      if (error instanceof PlanificadorConflictError) {
        if (payload.id) {
          setFormError(error.message)
        } else {
          setConflict({ payload, message: error.message })
        }
        return
      }
      setFormError(error.message || "No pudimos guardar esa comida.")
    }
  }

  return (
    <div>
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Planificador</h1>
        <p className="mt-2 text-base text-muted">Organizá tus comidas y prepará tu semana.</p>
      </header>

      <WeekNav
        monday={monday}
        onPrev={() => {
          setMonday((current) => addDays(current, -7))
          setMenuId(null)
        }}
        onNext={() => {
          setMonday((current) => addDays(current, 7))
          setMenuId(null)
        }}
      />

      {notice || queryNotice ? (
        <p className={`mt-4 text-sm ${queryNotice && !notice ? "text-primary" : "text-success"}`} role="status">
          {notice || queryNotice}
        </p>
      ) : null}

      {formDraft ? (
        <div className="mt-6">
          <AddMealForm
            key={`${formDraft.id ?? "new"}-${formDraft.fechaAsignada}-${formDraft.turno}-${formDraft.recetaId}`}
            recetas={recetas}
            initial={formDraft}
            error={formError}
            conflictMessage={conflict?.message ?? ""}
            onConfirmReplace={() => handleSubmit({ ...conflict.payload, reemplazarSiConflicto: true })}
            onDismissConflict={() => setConflict(null)}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </div>
      ) : null}

      {loading ? (
        <div className="mt-10 flex justify-center" role="status" aria-label="Cargando planificador">
          <Spinner size={24} className="text-primary" />
        </div>
      ) : (
        <WeekGrid
          days={days}
          meals={weekMeals}
          menuId={menuId}
          onToggleMenu={(id) => setMenuId((current) => (current === id ? null : id))}
          onAdd={handleAdd}
          onChange={handleChange}
          onRemove={handleRemove}
        />
      )}

      <section className="mt-8" aria-labelledby="resumen-semana">
        <h2 id="resumen-semana" className="text-xl font-bold tracking-tight text-ink">
          Resumen de la semana
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Card>
            <p className="text-2xl font-bold text-ink">{weekMeals.length}</p>
            <p className="mt-1 text-sm text-muted">comidas planificadas</p>
          </Card>
          <Card>
            <p className="text-2xl font-bold text-ink">{uniqueIngredients(weekMeals, recetas)}</p>
            <p className="mt-1 text-sm text-muted">ingredientes necesarios</p>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default PlanificadorPage
