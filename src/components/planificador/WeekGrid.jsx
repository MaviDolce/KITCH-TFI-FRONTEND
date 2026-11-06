import { TURNOS } from "../../constants/turnos"
import { formatDayHeading, toDateKey } from "../../utils/week"
import MealCell from "./MealCell"

function findMeal(meals, fecha, turno) {
  return meals.find((meal) => meal.fechaAsignada === fecha && meal.turno === turno)
}

function WeekGrid({ days, meals, menuId, onToggleMenu, onAdd, onChange, onRemove }) {
  return (
    <>
      <div className="mt-6 space-y-4 lg:hidden">
        {days.map((day) => {
          const fecha = toDateKey(day)
          return (
            <section
              key={fecha}
              className="rounded-3xl bg-surface p-4 shadow-sm"
              aria-labelledby={`dia-${fecha}`}
            >
              <h2 id={`dia-${fecha}`} className="text-base font-bold text-ink">
                {formatDayHeading(day)}
              </h2>
              <ul className="mt-3 grid gap-3">
                {TURNOS.map((turno) => {
                  const meal = findMeal(meals, fecha, turno)
                  const cellId = meal ? `meal-${meal.id}` : `${fecha}-${turno}`
                  return (
                    <li key={turno}>
                      <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted uppercase">
                        {turno}
                      </p>
                      <MealCell
                        meal={meal}
                        fecha={fecha}
                        turno={turno}
                        menuOpen={menuId === cellId}
                        onToggleMenu={() => onToggleMenu(cellId)}
                        onAdd={onAdd}
                        onChange={onChange}
                        onRemove={onRemove}
                      />
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      <div className="mt-6 hidden overflow-x-auto lg:block" role="region" aria-label="Plan semanal">
        <div className="min-w-[56rem] rounded-3xl bg-surface/60 p-4">
          <div className="grid grid-cols-[5.5rem_repeat(7,minmax(0,1fr))] gap-2">
            <div />
            {days.map((day) => (
              <p
                key={toDateKey(day)}
                className="px-1 text-center text-sm font-semibold text-ink"
              >
                {formatDayHeading(day)}
              </p>
            ))}

            {TURNOS.map((turno) => (
              <div key={turno} className="contents">
                <p className="flex items-center pr-2 text-sm font-semibold text-muted">{turno}</p>
                {days.map((day) => {
                  const fecha = toDateKey(day)
                  const meal = findMeal(meals, fecha, turno)
                  const cellId = meal ? `meal-${meal.id}` : `${fecha}-${turno}`
                  return (
                    <MealCell
                      key={`${fecha}-${turno}`}
                      meal={meal}
                      fecha={fecha}
                      turno={turno}
                      menuOpen={menuId === cellId}
                      onToggleMenu={() => onToggleMenu(cellId)}
                      onAdd={onAdd}
                      onChange={onChange}
                      onRemove={onRemove}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default WeekGrid
