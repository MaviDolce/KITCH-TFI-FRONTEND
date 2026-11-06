import { authService } from "./authService"

export const perfilService = {
  getMe: () => authService.getMe(),
  actualizar: (payload) => authService.updateMe(payload),
}
