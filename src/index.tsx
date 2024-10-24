import { App } from './app'
import { createRoot } from 'react-dom/client'
import 'normalize.css'
import './system-ui/styles/index.css'
import { configureAuth } from '@mercadona/mo.library.auth'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(<App />)

configureAuth({
  apiHost: import.meta.env.VITE_APP_API_HOST,
  logoutRedirectUrl: `https://${import.meta.env.VITE_APP_HOST}/`,
  isDevelopmentEnvironment: import.meta.env.VITE_APP_ENV === 'local',
  automaticLogoutTriggerTime: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
})
