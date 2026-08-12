import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Image, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/stories', label: 'Stories', icon: BookOpen },
  { to: '/admin/media', label: 'Медиа', icon: Image },
  { to: '/admin/settings', label: 'Настройки', icon: Settings },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-[#111111]">
      <div className="flex">
        <aside className="sticky top-0 flex h-screen w-60 flex-col justify-between border-r border-[#e7e7ea] bg-white p-5">
          <div>
            <div className="mb-8 text-xl font-extrabold tracking-tight">FinHome Admin</div>
            <nav className="flex flex-col gap-1">
              {NAV.map(({ to, label, icon: Icon }) => {
                const active =
                  to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#ffe9ee] text-[#b0002d]'
                        : 'text-[#6b6b73] hover:bg-[#f7f7f8]'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#6b6b73] hover:bg-[#f7f7f8]"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
