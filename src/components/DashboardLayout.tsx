import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Store, Package, LogOut, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Store as StoreType } from '../types'

export function DashboardLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [store, setStore] = useState<StoreType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('stores')
      .select('*')
      .eq('owner_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          navigate('/onboarding')
          return
        }
        setStore(data)
        setLoading(false)
      })
  }, [user, navigate])

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-marigold/10 text-marigold-dark' : 'text-ink/70 hover:bg-ink/5'
    }`

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-muted">
        Loading your store...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-60 flex-col border-r border-line bg-white px-4 py-6">
        <div className="mb-8 flex items-center gap-2 px-2 text-ink">
          <Store size={20} className="text-marigold" strokeWidth={2.25} />
          <span className="font-display text-lg">Apna Dukaan</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavLink to="/dashboard" end className={linkClass}>
            <Store size={17} /> Store settings
          </NavLink>
          <NavLink to="/dashboard/products" className={linkClass}>
            <Package size={17} /> Products
          </NavLink>
          {store && (
            <a
              href={`/store/${store.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-banyan-dark hover:bg-banyan/10"
            >
              <ExternalLink size={17} /> View storefront
            </a>
          )}
        </nav>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink/60 hover:bg-ink/5"
        >
          <LogOut size={17} /> Log out
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto px-10 py-8">
        <Outlet context={{ store, setStore }} />
      </main>
    </div>
  )
}
