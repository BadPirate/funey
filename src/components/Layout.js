import React from "react"
import { Container } from "react-bootstrap"

/**
 * Layout component that wraps all pages with the Funey background and a centered card.
 */
export default function Layout({ children }) {
  return (
    <div className="funey-background">
      <Container className="py-5">
        {children}
      </Container>
    </div>
  )
}