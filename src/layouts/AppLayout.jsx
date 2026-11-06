import { Outlet } from "react-router-dom"
import MobileHeader from "../components/layout/MobileHeader"
import MobileNav from "../components/layout/MobileNav"
import Sidebar from "../components/layout/Sidebar"

function AppLayout() {
  return (
    <div className="min-h-svh overflow-x-clip bg-canvas lg:flex">
      <Sidebar />
      <div className="flex min-h-svh min-w-0 flex-1 flex-col">
        <MobileHeader />
        <main
          id="contenido"
          tabIndex={-1}
          className="flex-1 scroll-mt-20 px-4 py-6 pb-32 lg:px-10 lg:py-8 lg:pb-8 lg:scroll-mt-8"
        >
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  )
}

export default AppLayout
