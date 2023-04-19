import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import BigMap from '../components/BigMap'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>roadworks map</title>
      </Head>

      <Header/>

      <main className={styles.main}>
        <BigMap/>
      </main>
    </div>
  )
}
