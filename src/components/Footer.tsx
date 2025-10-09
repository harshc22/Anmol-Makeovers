import { FaInstagram, FaTiktok } from 'react-icons/fa'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-background border-t border-gray text-dark px-6 py-5 mt-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 items-center text-center sm:text-left gap-4">
        
        {/* AB Initials */}
        <div className="text-2xl font-serif text-heading transition">
        <Link
            href="/"
            className="hover:text-primary transition"
        >
            AB
        </Link>
        </div>


        {/* Center Icons */}
        <div className="flex justify-center gap-5 text-xl">
          <a
            href="https://www.instagram.com/anmolmakeovers_/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-primary transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@benipalanmol"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="hover:text-primary transition"
          >
            <FaTiktok />
          </a>
        </div>

        {/* Right: Copyright */}
        <div className="text-sm text-gray-500 sm:text-right">
          © {new Date().getFullYear()} Anmol Makeovers. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
