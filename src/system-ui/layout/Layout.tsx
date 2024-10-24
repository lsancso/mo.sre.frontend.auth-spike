import { Header } from 'system-ui/header'

import './Layout.css'
import { LayoutProps } from './Layout.types'

export const Layout = ({ children }: LayoutProps) => (
  <div className="layout">
    <Header />
    <div className="layout__content">{children}</div>
  </div>
)
