import type { RouteRecord } from 'vite-react-ssg'
import { RootLayout } from './RootLayout'
import { Wishlist } from './pages/Wishlist'

// Product routes remain intentionally unavailable during the private preview.
// Legal pages stay public; every other path resolves to the wishlist.
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <RootLayout />,
    entry: 'src/RootLayout.tsx',
    children: [
      { index: true, element: <Wishlist />, entry: 'src/pages/Wishlist.tsx' },
      { path: 'privacy', lazy: () => import('./pages/Privacy') },
      { path: 'terms', lazy: () => import('./pages/Terms') },
      { path: '*', element: <Wishlist /> },
    ],
  },
]
