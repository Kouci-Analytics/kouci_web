import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const sections = [
  { id: 'hero', label: 'Introduction' },
  { id: 'pain', label: 'Existence' },
  { id: 'features', label: 'Features' },
  { id: 'showcase', label: 'In action' },
  { id: 'license', label: 'Club license' },
  { id: 'audience', label: 'Built for you' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
  { id: 'early-access', label: 'Early access' },
]

interface NavIconProps {
  name: string
  className?: string
}

function NavIcon({ name, className = 'h-5 w-5' }: NavIconProps) {
  let paths

  switch (name) {
    case 'home':
      paths = (
        <>
          <path d="m3 11 9-8 9 8" />
          <path d="M5.5 9.5V21h13V9.5M9.5 21v-6h5v6" />
        </>
      )
      break
    case 'hero':
      paths = (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="m14.8 9.2-1.7 3.9-3.9 1.7 1.7-3.9 3.9-1.7Z" />
        </>
      )
      break
    case 'pain':
      paths = (
        <>
          <path d="M10.3 4.2 3.4 16a2 2 0 0 0 1.7 3h13.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4M12 16.5h.01" />
        </>
      )
      break
    case 'features':
      paths = (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </>
      )
      break
    case 'showcase':
      paths = (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m10 8 6 4-6 4V8Z" />
        </>
      )
      break
    case 'license':
      paths = (
        <>
          <path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </>
      )
      break
    case 'audience':
      paths = (
        <>
          <circle cx="9" cy="9" r="3" />
          <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 7.5a3 3 0 0 1 0 5.8M17 15a5 5 0 0 1 3.5 4" />
        </>
      )
      break
    case 'pricing':
      paths = (
        <>
          <path d="m4 12 8-8h6v6l-8 8-6-6Z" />
          <circle cx="15.5" cy="7.5" r="1" />
        </>
      )
      break
    case 'faq':
      paths = (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.8 9a2.3 2.3 0 1 1 3.3 2.1c-.8.4-1.1.9-1.1 1.9M12 16.5h.01" />
        </>
      )
      break
    case 'early-access':
      paths = (
        <>
          <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3ZM18.5 14l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
          <path d="m6 13 .8 2.2L9 16l-2.2.8L6 19l-.8-2.2L3 16l2.2-.8L6 13Z" />
        </>
      )
      break
    case 'journal':
      paths = (
        <>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" />
        </>
      )
      break
    case 'checkout':
      paths = (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18M7 15h3" />
        </>
      )
      break
    default:
      paths = <path d="M5 7h14M5 12h14M5 17h14" />
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths}
    </svg>
  )
}

/**
 * Persistent section rail. On the landing page it tracks the section crossing
 * the visual reading line; elsewhere it remains a compact route back into the
 * landing page.
 */
export function Sidebar() {
  const location = useLocation()
  const { pathname } = location
  const isHome = pathname === '/'
  const [activeSection, setActiveSection] = useState(isHome ? 'hero' : '')

  useEffect(() => {
    if (!isHome) {
      setActiveSection('')
      return
    }

    let raf = 0
    const update = () => {
      const readingLine = window.innerHeight * 0.42
      let current = sections[0].id

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= readingLine) {
          current = section.id
        }
      }

      setActiveSection(current)
    }
    const scheduleUpdate = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      cancelAnimationFrame(raf)
    }
  }, [isHome])

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 bg-bg/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:hidden"
      >
        <div className="grid h-16 grid-cols-3">
          {[
            { to: '/', label: 'Home', icon: 'home', active: pathname === '/' },
            {
              to: '/checkout',
              label: 'Checkout',
              icon: 'checkout',
              active: pathname.startsWith('/checkout'),
            },
            {
              to: '/blog',
              label: 'Blog',
              icon: 'journal',
              active: pathname.startsWith('/blog'),
            },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              aria-current={item.active ? 'page' : undefined}
              className={`relative grid place-items-center transition-colors ${
                item.active ? 'text-brand-light' : 'text-silver/55 hover:text-ink'
              }`}
            >
              <NavIcon name={item.icon} className="h-6 w-6" />
              {item.active && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 h-1 w-1 rounded-full bg-brand-light shadow-[0_0_8px_rgba(159,172,130,0.7)]"
                />
              )}
            </Link>
          ))}
        </div>
      </nav>

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-48 flex-col overflow-x-hidden lg:flex">
        <Link
          to="/"
          aria-label="Kouci — home"
          className="group flex h-28 shrink-0 items-center justify-center"
        >
          <img
            src="/assets/logoKouci.png"
            alt=""
            width={72}
            height={72}
            className="h-[4.5rem] w-[4.5rem] object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <nav
          aria-label="Landing page sections"
          className="flex min-h-0 flex-1 items-center overflow-y-auto overflow-x-hidden"
        >
          <ol className="w-full space-y-1 px-5 py-4">
            {sections.map((section, index) => {
              const active = activeSection === section.id
              const href = isHome ? `#${section.id}` : `/#${section.id}`

              return (
                <li key={section.id}>
                  <a
                    href={href}
                    aria-label={section.label}
                    aria-current={active ? 'location' : undefined}
                    onClick={() => setActiveSection(section.id)}
                    className="group relative flex min-h-9 items-center py-2"
                  >
                    <span aria-hidden="true" className="relative block h-px w-10 shrink-0">
                      <span
                        className={`absolute left-0 top-0 h-px transition-all duration-500 ease-out ${
                          active
                            ? 'w-10 bg-brand-light shadow-[0_0_12px_rgba(159,172,130,0.65)]'
                            : 'w-4 bg-silver/25 group-hover:w-7 group-hover:bg-silver/60'
                        }`}
                      >
                        {active && (
                          <span className="absolute -right-0.5 -top-0.5 h-1 w-1 rounded-full bg-brand-light" />
                        )}
                      </span>
                    </span>
                    <span
                      className={`absolute inset-y-0 right-0 flex items-center break-words text-[10px] font-medium uppercase leading-tight tracking-[0.16em] transition-[left,color] duration-500 ease-out ${
                        active
                          ? 'left-[3.25rem] text-ink'
                          : 'left-7 text-silver/45 group-hover:left-10 group-hover:text-silver'
                      }`}
                    >
                      {section.label}
                    </span>
                    <span className="sr-only">Section {String(index + 1).padStart(2, '0')}</span>
                  </a>
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="shrink-0 px-5 py-6 text-center">
          <Link
            to="/blog"
            className="text-[10px] font-medium uppercase tracking-[0.18em] text-silver/50 transition-colors hover:text-brand-light"
          >
            Journal
          </Link>
          <Link
            to="/checkout"
            aria-label="Get the Kouci license"
            className="mx-auto mt-4 grid h-7 w-7 place-items-center rounded-full bg-brand/10 text-sm text-brand-light transition-colors hover:bg-brand/20"
          >
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
