import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import FullScreenLoader from './loader/FullScreenLoader'
import Sidebar, { COLLAPSED_WIDTH, EXPANDED_WIDTH } from './Sidebar'

export default function Layout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth > 767
  })
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const effectiveDesktopCollapsed = collapsed && !sidebarHovered
  const effectiveSidebarWidth = effectiveDesktopCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH

  useEffect(() => {
    const target = document.getElementById('main-page')
    if (!target) return
    target.classList.toggle('sidebar-collapsed', effectiveDesktopCollapsed)
    target.classList.toggle('sidebar-hover-open', collapsed && sidebarHovered)
    target.classList.toggle('sidebar-active', mobileSidebarOpen)
    target.style.setProperty('--parcelx-sidebar-width', `${effectiveSidebarWidth}px`)
  }, [collapsed, effectiveDesktopCollapsed, effectiveSidebarWidth, mobileSidebarOpen, sidebarHovered])

  useEffect(() => {
    const preloadRoutes = () => {
      void import('../../pages/dashboard/Dashboard')
      void import('../../pages/orders/Orders')
      void import('../../components/orders/CreateOrderWrapper')
      void import('../../pages/channels/ChannelOrders')
      void import('../../pages/reports/Reports')
      void import('../../pages/support/SupportTicketsPage')
    }

    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
      cancelIdleCallback?: (id: number) => void
    }

    let idleId: number | undefined
    let timeoutId: number | undefined

    if (typeof win.requestIdleCallback === 'function') {
      idleId = win.requestIdleCallback(() => preloadRoutes(), { timeout: 1400 })
    } else {
      timeoutId = window.setTimeout(preloadRoutes, 600)
    }

    return () => {
      if (idleId !== undefined && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleId)
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  useEffect(() => {
    if (window.innerWidth <= 767) {
      setMobileSidebarOpen(false)
    }
  }, [location.pathname])

  const toggleSidebar = () => {
    if (window.innerWidth <= 767) {
      setMobileSidebarOpen((value) => !value)
      return
    }
    setCollapsed((value) => !value)
  }

  return (
    <div id="main-page" className="main__section parcelx" style={{ ['--parcelx-sidebar-width' as string]: `${effectiveSidebarWidth}px` }}>
      <Sidebar
        collapsed={effectiveDesktopCollapsed}
        onToggle={toggleSidebar}
        onHoverChange={setSidebarHovered}
      />
      <div className="main__panel">
        <Navbar handleDrawerToggle={toggleSidebar} collapsed={collapsed} />
        <main className="warpperzz parcelx-main-content">
          <Suspense fallback={<FullScreenLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
