import { Link, useLocation } from 'react-router-dom'

const lockedSections = [
  'Introduction',
  'Features',
  'In action',
  'Club license',
  'Built for you',
  'Pricing',
  'FAQ',
  'Journal',
]

function LockIcon({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
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

/**
 * Product navigation remains visible while the preview is private. Locked
 * entries are deliberately rendered as non-interactive text, so they cannot
 * expose a route via keyboard, mouse, or copied links.
 */
export function Sidebar() {
  const { pathname } = useLocation()
  const isWishlist = pathname !== '/privacy' && pathname !== '/terms'

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-48 flex-col overflow-hidden border-r border-white/[0.04] bg-bg/35 backdrop-blur-sm lg:flex">
      <Link to="/" aria-label="Kouci — wishlist" className="relative left-0">
        <img
          src="/assets/logoKouci.png"
          alt=""
          width={500}
          height={500}
          className="absolute -left-[100px] h-[400px] w-[400px] max-w-none -rotate-[20deg] object-contain opacity-[0.03] grayscale"
        />
      </Link>

      <nav
        aria-label="Product sections"
        className="flex min-h-0 flex-1 items-center overflow-y-auto"
      >
        <ol className="w-full space-y-1 px-5 py-4">
          <li>
            <Link
              to="/"
              aria-current={isWishlist ? 'page' : undefined}
              className="group relative flex min-h-9 items-center py-2"
            >
              <span aria-hidden="true" className="relative block h-px w-10 shrink-0">
                <span
                  className={`absolute left-0 top-0 h-px transition-all ${
                    isWishlist
                      ? 'w-10 bg-brand-light shadow-[0_0_12px_rgba(159,172,130,0.65)]'
                      : 'w-4 bg-silver/25 group-hover:w-7 group-hover:bg-silver/60'
                  }`}
                >
                  {isWishlist && (
                    <span className="absolute -right-0.5 -top-0.5 h-1 w-1 rounded-full bg-brand-light" />
                  )}
                </span>
              </span>
              <span
                className={`absolute inset-y-0 right-0 flex items-center text-[10px] font-medium uppercase leading-tight tracking-[0.16em] transition-all ${
                  isWishlist
                    ? 'left-[3.25rem] text-ink'
                    : 'left-7 text-silver/50 group-hover:left-10 group-hover:text-ink'
                }`}
              >
                Wishlist
              </span>
            </Link>
          </li>

          {lockedSections.map((label) => (
            <li key={label}>
              <span
                aria-label={`${label} — locked`}
                aria-disabled="true"
                className="group relative flex min-h-9 cursor-not-allowed items-center py-2"
              >
                <span aria-hidden="true" className="relative block h-px w-10 shrink-0">
                  <span className="absolute left-0 top-0 h-px w-4 bg-silver/15" />
                </span>
                <span className="absolute inset-y-0 left-7 right-0 flex items-center gap-1.5 text-[10px] font-medium uppercase leading-tight tracking-[0.14em] text-silver/30">
                  <LockIcon className="h-2.5 w-2.5 shrink-0" />
                  {label}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="shrink-0 px-5 py-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-silver/35">
          <LockIcon className="h-2.5 w-2.5" />
          Private preview
        </div>
      </div>
    </aside>
  )
}
