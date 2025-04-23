import React from 'react'
import type { FC, ReactNode } from 'react'
import { Container } from 'react-bootstrap'

/**
 * Layout component that wraps all pages with the Funey background and a centered card.
 */
interface LayoutProps {
  children: ReactNode
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="funey-background">
      <Container className="py-5">{children}</Container>
    </div>
  )
}
export default Layout
