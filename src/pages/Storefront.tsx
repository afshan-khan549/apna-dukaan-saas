import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Phone, MapPin, Store as StoreIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Product, Store } from '../types'

export default function Storefront() {
  const { slug } = useParams<{ slug: string }>()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (!storeData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setStore(storeData)

      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id)
        .order('created_at', { ascending: false })

      setProducts(productsData ?? [])
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-paper text-muted">Loading...</div>
  }

  if (notFound || !store) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
        <p className="font-display text-2xl text-ink">No store found at this address</p>
        <p className="mt-2 text-sm text-muted">Double-check the link, or it may have been removed.</p>
        <Link to="/" className="mt-4 text-sm font-medium text-banyan hover:underline">
          Back to Apna Dukaan
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white px-6 py-16 text-center sm:px-10">
        {store.category && (
          <span className="stamp inline-block rounded border-2 border-marigold px-3 py-1 text-xs font-bold uppercase tracking-wide text-marigold-dark">
            {store.category}
          </span>
        )}
        <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">{store.name}</h1>
        {store.description && (
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">{store.description}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-ink/70">
          {store.address && (
            <span className="flex items-center gap-1.5">
              <MapPin size={15} className="text-marigold" /> {store.address}
            </span>
          )}
          {store.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={15} className="text-marigold" /> {store.phone}
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
        <h2 className="font-display text-2xl text-ink">What we offer</h2>

        {products.length === 0 ? (
          <p className="mt-4 text-sm text-muted">This store hasn't added any listings yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div key={p.id} className="rounded-2xl border border-line bg-white p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg text-ink">{p.name}</h3>
                  {!p.in_stock && (
                    <span className="shrink-0 rounded-full bg-error/10 px-2 py-0.5 text-xs font-medium text-error">
                      Out of stock
                    </span>
                  )}
                </div>
                {p.description && <p className="mt-1.5 text-sm text-muted">{p.description}</p>}
                {p.price !== null && (
                  <p className="mt-3 font-display text-lg text-marigold-dark">₹{p.price}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-line px-6 py-8 text-center text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <StoreIcon size={13} /> Powered by Apna Dukaan
        </span>
      </footer>
    </div>
  )
}
