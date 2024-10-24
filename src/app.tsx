import { BrowserRouter } from 'react-router-dom'

import { Routes } from 'pages/routes'
import { Layout } from 'system-ui/layout'
import { MoAuthProvider } from '@mercadona/mo.library.auth'

export const App = () => (
  <MoAuthProvider>
    <BrowserRouter>
      <Layout>
        <Routes />
      </Layout>
    </BrowserRouter>
  </MoAuthProvider>
)
