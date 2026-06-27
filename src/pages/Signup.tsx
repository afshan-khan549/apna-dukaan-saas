import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Store } from 'lucide-react'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await signUp(email, password)
    setSubmitting(false)
    if (error) {
      setError(error)
      return
    }
    setCheckEmail(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2 text-ink">
          <Store size={22} className="text-marigold" strokeWidth={2.25} />
          <span className="font-display text-xl">Apna Dukaan</span>
        </div>

        <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
          <h1 className="font-display text-2xl text-ink">Set up your store</h1>
          <p className="mt-1 text-sm text-muted">Free to join. Takes about a minute.</p>

          {checkEmail ? (
            <div className="mt-6 space-y-3">
              <p className="rounded-lg bg-banyan/10 px-3 py-2 text-sm text-banyan-dark">
                Account created. If your Supabase project has email confirmation on, confirm via
                the link in your inbox first. Otherwise you're already logged in.
              </p>
              <button
                onClick={() => navigate('/onboarding')}
                className="w-full rounded-lg bg-marigold px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-marigold-dark"
              >
                Continue to set up your store
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20"
                  placeholder="At least 6 characters"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-marigold px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-marigold-dark disabled:opacity-60"
              >
                {submitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Already have a store?{' '}
          <Link to="/login" className="font-medium text-banyan hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
