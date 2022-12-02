import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="p-4 text-center text-blue-500 bg-teal-100">
      <Link
        className="hover:underline hover:font-bold"
        href="https://www.linkedin.com/in/justen-falk/"
      >
        Made by Justen Falk
      </Link>
    </footer>
  );
}
