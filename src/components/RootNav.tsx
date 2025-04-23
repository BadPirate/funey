import { Navbar, Container } from 'react-bootstrap'
import Link from 'next/link'

const RootNav = () => (
  <Navbar bg="light" expand="lg">
    <Container>
      <Link href="/" passHref>
        <Navbar.Brand>Funey</Navbar.Brand>
      </Link>
    </Container>
  </Navbar>
)

export default RootNav
