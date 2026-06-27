import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { slugify } from '../utils/slugify'
import { Store } from 'lucide-react'

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setError(null)
    setSubmitting(true)

    const baseSlug = slugify(name)
    const slug = `${baseSlug}-${user.id.slice(0, 6)}`

    const { error } = await supabase.from('stores').insert({
      owner_id: user.id,
      name,
      slug,
      category,
    })

    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2 text-ink">
          <Store size={22} className="text-marigold" strokeWidth={2.25} />
          <span className="font-display text-xl">Apna Dukaan</span>
        </div>

        <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
          <h1 className="font-display text-2xl text-ink">Name your store</h1>
          <p className="mt-1 text-sm text-muted">
            This is what customers will see on your storefront page.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink">
                Store name
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20"
                placeholder="e.g. Khan General Store"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-ink">
                Category
              </label>
              <input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20"
                placeholder="e.g. Grocery, Tailoring, Bakery"
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
              {submitting ? 'Creating store...' : 'Create store'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
