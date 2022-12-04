import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export interface HeaderProps {
  pageName: string;
  url: string;
}

export default function Header({ pageName, url }: HeaderProps) {
  return (
    <>
      <Head>
        <title>Strive Flow Simulation Exercise</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex justify-between items-center p-4 bg-teal-100">
        <Link href="/">
          <Image
            src="/strive.svg"
            width="380"
            height="60"
            alt="Strive Messaging"
            priority
          />
        </Link>

        <Link href={url}>{pageName}</Link>
      </header>
    </>
  );
};
