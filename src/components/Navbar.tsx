'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Sling as Hamburger } from 'hamburger-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-background px-4 sm:px-6 py-4 shadow-md text-dark border-b border-gray fixed top-0 right-0 left-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl sm:text-3xl md:text-5xl font-serif text-heading hover:text-primary transition"
        >
          ANMOL MAKEOVERS
        </Link>


        {/* Hamburger - visible only on mobile */}
        <button
          className="md:hidden text-3xl text-primary focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <Hamburger toggled={isOpen} toggle={setIsOpen} size={20} direction="right"/>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 items-center text-primary font-sans">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <Link href="/portfolio" className="hover:text-primary transition">Portfolio</Link>
          <Link href="/about" className="hover:text-primary transition">About</Link>
          <Link
            href="/booking"
            className="ml-4 bg-primary text-light px-5 py-2 rounded-full hover:bg-primaryHover transition"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col gap-4 text-lg">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <Link href="/portfolio" className="hover:text-primary transition">Portfolio</Link>
            <Link href="/about" className="hover:text-primary transition">About</Link>
            <Link
              href="/booking"
              className="bg-primary text-light text-center py-2 rounded-full hover:bg-primaryHover transition"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
