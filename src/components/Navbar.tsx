'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-[#f7eeea] px-6 py-4 shadow-md text-gray-800">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-5xl font-serif text-[#81453b]">
          ANMOL BENIPAL
        </h1>

        {/* Hamburger - visible only on mobile */}
        <button
          className="md:hidden text-2xl text-[#cf988b] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-4 items-center text-base">
          <Link href="/" className="hover:text-[#cf988b] transition">Home</Link>
          <Link href="/portfolio" className="hover:text-[#cf988b] transition">Portfolio</Link>
          <Link href="/about" className="hover:text-[#cf988b] transition">About</Link>
          <Link
            href="/booking"
            className="ml-4 bg-[#cf988b] text-white px-5 py-2 rounded-md hover:bg-[#bb8378] transition"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 px-6">
          <Link href="/" className="hover:text-[#cf988b]">Home</Link>
          <Link href="/portfolio" className="hover:text-[#cf988b]">Portfolio</Link>
          <Link href="/about" className="hover:text-[#cf988b]">About</Link>
          <Link
            href="/booking"
            className="bg-[#cf988b] text-white text-center py-2 rounded-md hover:bg-[#bb8378]"
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  )
}
