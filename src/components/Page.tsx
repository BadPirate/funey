
import type { ReactNode } from 'react'
import Layout from './Layout'
import RootNav from './RootNav'

interface PageProps {
  children: ReactNode
}

const Page = ({ children }: PageProps) => (
  <Layout>
    <RootNav />
    {children}
  </Layout>
)

export default Page
