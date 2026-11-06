import Button from "../ui/Button"

function GoogleButton() {
  return (
    <div className="grid gap-2">
      <Button type="button" variant="outline" className="w-full" disabled>
        Continuar con Google
      </Button>
      <p className="text-center text-xs text-muted">Próximamente</p>
    </div>
  )
}

export default GoogleButton
