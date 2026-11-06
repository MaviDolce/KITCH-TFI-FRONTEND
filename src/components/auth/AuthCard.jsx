import Card from "../ui/Card"

function AuthCard({ title, subtitle, children }) {
  return (
    <Card className="w-full">
      <h1 className="text-[1.75rem] font-bold tracking-tight text-ink">{title}</h1>
      {subtitle ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </Card>
  )
}

export default AuthCard
