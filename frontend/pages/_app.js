import React from 'react'
import Head from 'next/head'
import '../public/static/css/styles.css'
 
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
 
export default MyApp;