import dynamic from 'next/dynamic'
import Head from 'next/head'
import 'normalize.css';

//import Template from '../components/Template'
const Template = dynamic(() => import("../components/Template"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>DeSo Template App</title>
        <meta name="description" content="Template of DeSo app in ReactJS by @btrootle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Template />
    </>
  )
}
