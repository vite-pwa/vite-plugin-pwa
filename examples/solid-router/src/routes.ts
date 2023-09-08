import { lazy } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'

import Home from './pages/home'
import HiData from './pages/hi/[name].data'

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
