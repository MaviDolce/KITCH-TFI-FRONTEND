import { Navigate, Route, Routes } from "react-router-dom"
import { ROUTES } from "../constants/routes"
import AppLayout from "../layouts/AppLayout"
import AuthLayout from "../layouts/AuthLayout"
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import ResetPasswordPage from "../pages/auth/ResetPasswordPage"
import VerifyCodePage from "../pages/auth/VerifyCodePage"
import AlacenaPage from "../pages/alacena/AlacenaPage"
import ComprasPage from "../pages/compras/ComprasPage"
import ExplorarPage from "../pages/explorar/ExplorarPage"
import FavoritosPage from "../pages/favoritos/FavoritosPage"
import HomePage from "../pages/home/HomePage"
import KitchIaPage from "../pages/kitch-ia/KitchIaPage"
import PerfilPage from "../pages/perfil/PerfilPage"
import PlanificadorPage from "../pages/planificador/PlanificadorPage"
import SuscripcionPage from "../pages/suscripcion/SuscripcionPage"
import RecipeDetailPage from "../pages/recetas/RecipeDetailPage"
import CocinarPage from "../pages/recetas/CocinarPage"
import SetupPage from "../pages/setup/SetupPage"
import GuestOnly from "./GuestOnly"
import RequireAuth from "./RequireAuth"

function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.ui} element={<SetupPage />} />

      <Route element={<GuestOnly />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.register} element={<RegisterPage />} />
          <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />
          <Route path={ROUTES.verifyCode} element={<VerifyCodePage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.explorar} element={<ExplorarPage />} />
          <Route path={ROUTES.alacena} element={<AlacenaPage />} />
          <Route path={ROUTES.kitchIa} element={<KitchIaPage />} />
          <Route path={ROUTES.planificador} element={<PlanificadorPage />} />
          <Route path={ROUTES.compras} element={<ComprasPage />} />
          <Route path={ROUTES.perfil} element={<PerfilPage />} />
          <Route path={ROUTES.suscripcion} element={<SuscripcionPage />} />
          <Route path={ROUTES.favoritos} element={<FavoritosPage />} />
          <Route path={ROUTES.recetaDetalle} element={<RecipeDetailPage />} />
          <Route path={ROUTES.recetaCocinar} element={<CocinarPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  )
}

export default AppRouter
