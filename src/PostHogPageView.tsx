import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import posthog from 'posthog-js'

const PostHogPageView = (): null => {
  const location = useLocation()

  useEffect(() => {
    posthog.capture('$pageview')
  }, [location.pathname])

  return null
}

export default PostHogPageView
