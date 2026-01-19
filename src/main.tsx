import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider.tsx'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - plugin provides virtual module at build time
import { registerSW } from 'virtual:pwa-register'
import posthog from 'posthog-js'; 
import { PostHogProvider } from '@posthog/react' 
import { attachPostHogRouter } from './analytics/posthogRouter.ts'
import { router } from './routes/index.tsx'

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, { 
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST, 
  // defaults: '2025-11-30', 
  capture_pageview: false,
}); 

attachPostHogRouter(router)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <PostHogProvider client={posthog}>
        <App />
      </PostHogProvider>
    </ThemeProvider>
  </StrictMode>
)

// Register PWA service worker
registerSW()
