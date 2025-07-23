"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      {/* Full width bar */}
      <div className="flex items-center justify-between h-16 w-full px-4 sm:px-6 lg:px-8">
        
        {/* Logo flush left */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-bold text-primary">
            Travelytics
          </Link>
        </div>

        {/* Centered nav links */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <nav className="flex gap-30 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/doc" className="hover:text-foreground transition-colors">Docs</Link>
          </nav>
        </div>

      </div>
    </header>
  );
}