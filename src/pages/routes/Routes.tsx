import { Route, Routes as RouterRoutes } from 'react-router-dom'

import { Home } from '../home'
import { PATHS } from '../paths'

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path={PATHS.HOME} element={<Home />} />
    </RouterRoutes>
  )
}
