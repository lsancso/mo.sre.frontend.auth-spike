import '@testing-library/jest-dom/vitest'
import { configure, matchers } from 'wrapito-vitest'
import { render } from '@testing-library/react'
import { expect } from 'vitest'
import { configureAuth } from '@mercadona/mo.library.auth'

const { VITE_APP_API_HOST: defaultHost } = import.meta.env

configure({
  defaultHost,
  mount: render,
  portal: 'modal-root',
})

expect.extend(matchers)

configureAuth({
  apiHost: import.meta.env.VITE_APP_API_HOST,
  logoutRedirectUrl: `https://${import.meta.env.VITE_APP_HOST}/`,
  automaticLogoutTriggerTime: 8 * 60 * 60 * 1000,
  isDevelopmentEnvironment: true,
})
