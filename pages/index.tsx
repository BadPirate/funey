
import type { NextPage } from 'next'
import Page from '../src/components/Page'
import WelcomeCard from '../src/cards/WelcomeCard'

const Home: NextPage = () => (
  <Page>
    <WelcomeCard />
  </Page>
)

export default Home
