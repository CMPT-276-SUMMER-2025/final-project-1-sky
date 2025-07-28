"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
      {/* Full width bar */}
      <div className="flex items-center justify-between h-16 w-full px-4 sm:px-6 lg:px-8">
        
        {/* Logo flush left */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png"
              alt="Travelytics Logo"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Centered nav links */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <nav className="flex gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors duration-200">
              Home
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors duration-200">
              About
            </Link>
            <Link href="/doc" className="hover:text-blue-600 transition-colors duration-200">
              Docs
            </Link>
          </nav>
        </div>

      </div>
    </header>
  );
}