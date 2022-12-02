import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <>
      <Head>
        <title>Strive Flow Simulation Exercise</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-12 sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src="/strive.svg"
            width="380"
            height="60"
            alt="Strive Messaging"
            priority
          />
        </Link>
      </header>
    </>
  );
};
