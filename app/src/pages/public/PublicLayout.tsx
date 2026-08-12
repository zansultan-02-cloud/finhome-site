import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'Главная' },
  { to: '/support', label: 'Поддержка' },
  { to: '/privacy', label: 'Конфиденциальность' },
]

export function PublicLayout({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  useEffect(() => {
    document.title = title
    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
  }, [title, description])

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-[#111111]">
      <header className="sticky top-0 z-10 border-b border-[#e7e7ea] bg-[#f7f7f8]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1080px] items-center justify-between px-6">
          <div className="text-2xl font-extrabold tracking-tight">FinHome</div>
          <nav className="flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="ml-3 text-sm text-[#111111] no-underline sm:ml-6"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="px-6 pb-12 pt-9 text-center text-sm text-[#6b6b73]">
        © 2026 FinHome. All rights reserved.
        {' · '}
        <Link to="/admin" className="text-[#6b6b73] underline-offset-2 hover:underline">
          Админ
        </Link>
      </footer>
    </div>
  )
}
