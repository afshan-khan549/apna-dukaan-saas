import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <p className="font-display text-3xl text-ink">Page not found</p>
      <Link to="/" className="mt-4 text-sm font-medium text-banyan hover:underline">
        Back to home
      </Link>
    </div>
  )
}
