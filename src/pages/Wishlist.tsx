import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WISHLIST_ENDPOINT = import.meta.env.VITE_WISHLIST_ENDPOINT

type Errors = { name?: string; email?: string }
type Status = 'idle' | 'submitting' | 'success' | 'error'

async function fetchWishlistCount(signal?: AbortSignal) {
  if (!WISHLIST_ENDPOINT) throw new Error('Missing VITE_WISHLIST_ENDPOINT')

  const response = await fetch(WISHLIST_ENDPOINT, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) throw new Error('Wishlist count request failed')

  const data: unknown = await response.json()
  if (
    typeof data !== 'object' ||
    data === null ||
    !('count' in data) ||
    typeof data.count !== 'number' ||
    !Number.isInteger(data.count) ||
    data.count < 0
  ) {
    throw new Error('Invalid wishlist count response')
  }

  return data.count
}

function LockIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 h-5 w-5 shrink-0"
    >
      <path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function Wishlist() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [wishlistCount, setWishlistCount] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function refreshCount() {
      try {
        const count = await fetchWishlistCount(controller.signal)
        setWishlistCount(count)
      } catch {
        // The form remains usable if the optional social-proof count is unavailable.
      }
    }

    void refreshCount()
    const interval = window.setInterval(refreshCount, 30_000)

    return () => {
      controller.abort()
      window.clearInterval(interval)
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: Errors = {}
    if (!name.trim()) nextErrors.name = 'Please enter your full name.'
    if (!EMAIL_RE.test(email.trim())) nextErrors.email = 'Please enter a valid email address.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')

    try {
      if (!WISHLIST_ENDPOINT) throw new Error('Missing VITE_WISHLIST_ENDPOINT')
      const response = await fetch(WISHLIST_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
        }),
      })

      if (!response.ok) throw new Error('Wishlist request failed')
      setStatus('success')
      void fetchWishlistCount()
        .then(setWishlistCount)
        .catch(() => undefined)
    } catch {
      setStatus('error')
    }
  }

  const firstName = name.trim().split(/\s+/)[0]

  return (
    <>
      <Seo
        title="Join the Kouci Wishlist"
        description="Join the Kouci wishlist to hear when private water polo app demos become available."
        path="/"
      />

      <main id="main" className="relative isolate flex min-h-screen overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_18%,rgba(126,139,99,0.19),transparent_33%),radial-gradient(circle_at_18%_82%,rgba(159,172,130,0.08),transparent_32%)]"
        />
        <div
          aria-hidden="true"
          className="wishlist-grid pointer-events-none absolute inset-0 -z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 top-12 -z-10 h-[32rem] w-[32rem] rounded-full border border-brand/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-28 -z-10 h-[23rem] w-[23rem] rounded-full border border-brand/10"
        />

        <div className="container-content my-auto py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.78fr)] lg:gap-20">
            <section aria-labelledby="wishlist-heading" className="wishlist-copy-enter max-w-2xl">
              <p className="mt-8 font-display text-sm font-medium uppercase tracking-[0.26em] text-silver/45">
                The next play is taking shape
              </p>
              <h1
                id="wishlist-heading"
                className="mt-4 max-w-xl text-5xl font-semibold leading-[0.98] text-ink sm:text-6xl lg:text-7xl"
              >
                Kouci is under wraps.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-silver sm:text-lg">
                We’re building a better way to read the game, prepare your team, and master every
                play. The app is private for now, but you can be first in line to see it.
              </p>

              {wishlistCount !== null && (
                <div
                  aria-live="polite"
                  className="mt-8 inline-flex items-center gap-3 text-sm text-silver"
                >
                  <span className="relative flex h-3 w-3" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-light opacity-50" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-light" />
                  </span>
                  <span>
                    <span className="font-semibold tabular-nums text-ink">
                      {wishlistCount.toLocaleString()}
                    </span>{' '}
                    Wishlists submitted
                  </span>
                </div>
              )}

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3" aria-label="Product status">
                {[
                  ['01', 'Build'],
                  ['02', 'Private demos'],
                  ['03', 'Launch'],
                ].map(([number, label], index) => (
                  <div key={number} className="border-t border-white/10 pt-3">
                    <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-silver/35">
                      <span>{number}</span>
                      {index > 0 && <LockIcon className="h-2.5 w-2.5" />}
                    </div>
                    <p
                      className={`mt-1.5 text-xs sm:text-sm ${index === 0 ? 'text-brand-light' : 'text-silver/55'}`}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="form-heading"
              className="wishlist-enter relative overflow-hidden rounded-3xl border border-white/10 bg-surface/80 p-6 shadow-[0_32px_90px_-35px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-light/70 to-transparent"
              />

              {status === 'success' ? (
                <div
                  role="status"
                  className="flex min-h-[25rem] flex-col items-center justify-center text-center"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-full border border-brand/30 bg-brand/10 text-brand-light">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="h-6 w-6"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </div>
                  <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.2em] text-brand-light">
                    Wishlist joined
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-ink">You’re in, {firstName}.</h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-silver">
                    We’ll keep your place and only reach out when there’s something worth showing.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-xs text-silver/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-ink"
                  >
                    Use a different email
                  </button>
                </div>
              ) : (
                <>
                  <p className="eyebrow">Wishlist</p>
                  <h2
                    id="form-heading"
                    className="mt-3 text-2xl font-semibold text-ink sm:text-3xl"
                  >
                    Be first to see Kouci
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-silver/80">
                    Leave your details and we’ll let you know when private demos become available.
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                    {status === 'error' && (
                      <div
                        role="alert"
                        className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-center text-sm text-red-200"
                      >
                        Something went wrong. Please try again.
                      </div>
                    )}
                    <Field
                      id="wishlist-name"
                      name="name"
                      label="Full Name"
                      type="text"
                      autoComplete="name"
                      placeholder="Alex Marques"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      error={errors.name}
                    />
                    <Field
                      id="wishlist-email"
                      name="email"
                      label="Email Address"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="alex@club.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      error={errors.email}
                    />

                    <div className="flex gap-3 rounded-2xl border border-brand/15 bg-brand/[0.07] p-4 text-brand-light">
                      <ShieldIcon />
                      <p className="text-xs leading-relaxed text-silver/80">
                        <span className="font-medium text-ink">No spam. No noisy newsletter.</span>{' '}
                        This wishlist only helps us understand who would like a Kouci demo in the
                        future. We’ll treat your inbox with respect.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      withArrow={status !== 'submitting'}
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? 'Joining…' : 'Join the wishlist'}
                    </Button>
                  </form>

                  <p className="mt-5 text-center text-[11px] leading-relaxed text-silver/40">
                    By joining, you agree that we may contact you about Kouci. Read our{' '}
                    <Link
                      to="/privacy"
                      className="text-silver/65 underline underline-offset-2 hover:text-ink"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </>
              )}
            </section>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-white/5 pt-5 text-[10px] uppercase tracking-[0.16em] text-silver/30 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Kouci</span>
            <div className="flex gap-4">
              <Link to="/privacy" className="transition-colors hover:text-silver">
                Privacy
              </Link>
              <Link to="/terms" className="transition-colors hover:text-silver">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
