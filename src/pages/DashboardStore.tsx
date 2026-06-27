import { useState, type FormEvent, type ReactNode } from 'react'
import { useOutletContext } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Store } from '../types'

interface OutletCtx {
  store: Store
  setStore: (s: Store) => void
}

export default function DashboardStore() {
  const { store, setStore } = useOutletContext<OutletCtx>()
  const [form, setForm] = useState({
    name: store.name,
    category: store.category ?? '',
    description: store.description ?? '',
    phone: store.phone ?? '',
    address: store.address ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { data, error } = await supabase
      .from('stores')
      .update(form)
      .eq('id', store.id)
      .select()
      .single()

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setStore(data)
    setSaved(true)
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-ink">Store settings</h1>
      <p className="mt-1 text-sm text-muted">
        This information shows up on your public storefront at{' '}
        <span className="font-medium text-ink">/store/{store.slug}</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6">
        <Field label="Store name">
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Category">
          <input
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="input"
            placeholder="e.g. Grocery, Tailoring, Bakery"
          />
        </Field>
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="input min-h-24 resize-none"
            placeholder="What does your store offer? What makes it worth a visit?"
          />
        </Field>
        <Field label="Phone">
          <input
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="input"
            placeholder="e.g. 98765 43210"
          />
        </Field>
        <Field label="Address">
          <input
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className="input"
            placeholder="Shop number, street, area"
          />
        </Field>

        {error && <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}
        {saved && (
          <p className="rounded-lg bg-banyan/10 px-3 py-2 text-sm text-banyan-dark">Saved.</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-marigold px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-marigold-dark disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
