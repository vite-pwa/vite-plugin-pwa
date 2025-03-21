import type { RouteDefinition } from '@solidjs/router'
import { lazy } from 'solid-js'

import HiData from './pages/hi/[name].data'
import Home from './pages/home'

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
  },
  {
    path: '/hi/:name',
    component: lazy(() => import('./pages/hi/[name]')),
    data: HiData,
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
]
