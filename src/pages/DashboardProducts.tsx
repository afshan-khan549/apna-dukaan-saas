import { useEffect, useState, type FormEvent } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Pencil, Trash2, Download, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { downloadCatalogPdf } from '../utils/catalogPdf'
import type { Product, Store } from '../types'

interface OutletCtx {
  store: Store
}

const emptyForm = { name: '', description: '', price: '', in_stock: true }

export default function DashboardProducts() {
  const { store } = useOutletContext<OutletCtx>()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function loadProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', store.id)
      .order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.id])

  function openAddForm() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEditForm(product: Product) {
    setEditing(product)
    setForm({
      name: product.name,
      description: product.description ?? '',
      price: product.price?.toString() ?? '',
      in_stock: product.in_stock,
    })
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      name: form.name,
      description: form.description || null,
      price: form.price ? Number(form.price) : null,
      in_stock: form.in_stock,
    }

    const { error } = editing
      ? await supabase.from('products').update(payload).eq('id', editing.id)
      : await supabase.from('products').insert({ ...payload, store_id: store.id })

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setShowForm(false)
    loadProducts()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    loadProducts()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Products & services</h1>
          <p className="mt-1 text-sm text-muted">{products.length} listed</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadCatalogPdf(store, products)}
            className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5"
          >
            <Download size={16} /> Export PDF
          </button>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 rounded-lg bg-marigold px-4 py-2 text-sm font-semibold text-white hover:bg-marigold-dark"
          >
            <Plus size={16} /> Add product
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-display text-lg text-ink">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted">
            Add your first product or service to show it on your storefront.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg text-ink">{p.name}</h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.in_stock ? 'bg-banyan/10 text-banyan-dark' : 'bg-error/10 text-error'
                  }`}
                >
                  {p.in_stock ? 'In stock' : 'Out of stock'}
                </span>
              </div>
              {p.description && <p className="mt-1.5 text-sm text-muted">{p.description}</p>}
              {p.price !== null && (
                <p className="mt-3 font-display text-lg text-marigold-dark">₹{p.price}</p>
              )}
              <div className="mt-4 flex gap-2 border-t border-line pt-3">
                <button
                  onClick={() => openEditForm(p)}
                  className="flex items-center gap-1.5 text-sm font-medium text-ink/70 hover:text-ink"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex items-center gap-1.5 text-sm font-medium text-error/80 hover:text-error"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-ink/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">
                {editing ? 'Edit product' : 'Add product'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-ink/50 hover:text-ink">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                required
                placeholder="Product or service name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="input min-h-20 resize-none"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price in ₹ (optional)"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="input"
              />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.in_stock}
                  onChange={(e) => setForm((f) => ({ ...f, in_stock: e.target.checked }))}
                  className="h-4 w-4 rounded border-line text-marigold focus:ring-marigold/30"
                />
                In stock
              </label>

              {error && (
                <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-marigold px-4 py-2.5 text-sm font-semibold text-white hover:bg-marigold-dark disabled:opacity-60"
              >
                {saving ? 'Saving...' : editing ? 'Save changes' : 'Add product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
