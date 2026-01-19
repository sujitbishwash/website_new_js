import posthog from 'posthog-js'
import type { Router as RemixRouter } from '@remix-run/router'

export const attachPostHogRouter = (router: RemixRouter) => {
  router.subscribe((state) => {
    if (state.location) {
      posthog.capture('$pageview', {
        path: state.location.pathname,
      })
    }
  })
}
