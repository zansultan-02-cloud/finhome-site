import { useState, type FormEvent } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function Login() {
  const { signIn, isAuthenticated, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setError('Неверный email или пароль')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-[22px] border border-[#e7e7ea] bg-white p-8 shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
      >
        <div className="mb-6 text-xl font-extrabold tracking-tight">FinHome Admin</div>

        <label className="mb-1 block text-sm font-medium text-[#6b6b73]">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
        />

        <label className="mb-1 block text-sm font-medium text-[#6b6b73]">Пароль</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
        />

        {error && <p className="mb-4 text-sm text-[#b0002d]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[#ff3b5c] py-2.5 font-bold text-white disabled:opacity-60"
        >
          {submitting ? 'Входим…' : 'Войти'}
        </button>

        <div className="mt-5 flex justify-center gap-4 text-sm text-[#6b6b73]">
          <Link to="/" className="hover:underline">
            На главную
          </Link>
          <Link to="/support" className="hover:underline">
            Поддержка
          </Link>
        </div>
      </form>
    </div>
  )
}
