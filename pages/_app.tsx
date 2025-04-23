import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/funey.css'
import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import ErrorBoundary from '../src/components/ErrorBoundary'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
    <Layout>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </Layout>
  </>
)

export default MyApp
