import { userInitial } from "../../utils/profile"

function ProfileHero({ user, plan }) {
  const initial = userInitial(user)

  return (
    <div className="mt-6 flex items-center gap-4">
      <div
        className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-2xl font-bold text-primary"
        aria-hidden="true"
      >
        {initial.toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            {user.nombre} {user.apellido}
          </h2>
          <span className="rounded-full bg-line px-3 py-1 text-xs font-semibold text-muted">
            {plan}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-muted">{user.email}</p>
      </div>
    </div>
  )
}

export default ProfileHero
