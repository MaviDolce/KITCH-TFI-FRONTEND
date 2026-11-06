import { Link } from "react-router-dom"
import Card from "../ui/Card"

function ProfileNavCard({ icon: Icon, title, tone = "primary", onClick, to }) {
  const toneClass = tone === "accent" ? "text-warning" : "text-primary"
  const classes =
    "flex h-[115px] w-full flex-col justify-between p-5 text-left transition-colors duration-150 hover:bg-ai focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

  const content = (
    <>
      <Icon size={22} className={toneClass} aria-hidden="true" />
      <p className={`text-base font-semibold ${toneClass}`}>{title}</p>
    </>
  )

  if (to) {
    return (
      <Card as={Link} to={to} padding={false} className={classes}>
        {content}
      </Card>
    )
  }

  return (
    <Card as="button" type="button" padding={false} className={classes} onClick={onClick}>
      {content}
    </Card>
  )
}

export default ProfileNavCard
