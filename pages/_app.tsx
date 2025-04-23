
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps) => (
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  <Component {...pageProps} />
)

export default MyApp
