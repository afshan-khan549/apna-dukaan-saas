import { Link } from 'react-router-dom'
import { Store, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <div className="mb-4 flex items-center gap-2 text-ink">
        <Store size={26} className="text-marigold" strokeWidth={2.25} />
        <span className="font-display text-2xl">Apna Dukaan</span>
      </div>

      <h1 className="max-w-xl font-display text-4xl text-ink sm:text-5xl">
        A simple storefront page for your shop.
      </h1>
      <p className="mt-4 max-w-md text-base text-muted">
        Add your products, share one link. No app to download, nothing to install — your
        customers just open it in their browser.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          to="/signup"
          className="flex items-center gap-2 rounded-lg bg-marigold px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-marigold-dark"
        >
          Set up your store <ArrowRight size={16} />
        </Link>
        <Link
          to="/login"
          className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5"
        >
          Log in
        </Link>
      </div>
    </div>
  )
}
