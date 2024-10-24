import { wrap } from 'wrapito-vitest'
import { screen } from '@testing-library/react'

import { App } from 'app'

it('should render correctly the home', () => {
  wrap(App).mount()

  const homeTitle = screen.getByRole('heading', { name: 'Home' })

  expect(homeTitle).toBeInTheDocument()
})
