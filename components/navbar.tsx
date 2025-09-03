"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search as SearchIcon } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const nav = [
    { name: "ABOUT", href: "/about" },
    { name: "SERVICES", href: "/services" },
    { name: "CAREER", href: "/career" },
    { name: "CONTACT", href: "/contact" },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4">
        <div className="h-[72px] flex items-center gap-6">
          {/* LOGO + NAME */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/castpro-logo.png"
              alt="Castpro"
              width={36}
              height={36}
              className="h-[36px] w-auto"
            />
            <span
              className="text-white text-2xl font-bold italic"
              style={{ fontFamily: `'Pacifico', cursive` }}
            >
              Castpro Engineering
            </span>
          </Link>

          {/* Links (desktop) */}
          <nav className="hidden lg:flex items-center gap-8 ml-4">
            {nav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-white font-extrabold tracking-wide text-[14px] hover:text-white/80 ${
                  pathname === item.href ? "underline underline-offset-8" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Search */}
          <form
            action="/search"
            className="hidden md:flex items-center h-[44px] w-[280px] rounded-[12px] bg-white border border-black/15 overflow-hidden"
          >
            <span className="px-3 text-slate-500">
              <SearchIcon className="w-[18px] h-[18px]" />
            </span>
            <input
              name="q"
              type="search"
              placeholder="Search..."
              className="w-full h-full text-[14px] bg-white outline-none placeholder:text-slate-500"
            />
          </form>

          {/* CTA button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/submit-project"
              className="inline-flex items-center justify-center h-[44px] px-5 rounded-[12px] bg-[#d61f1f] hover:bg-[#bf1b1b] text-white text-[13px] font-extrabold tracking-wide transition-colors whitespace-nowrap"
            >
              GET STARTED
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden rounded-lg px-3 py-2 border border-white/25 text-white"
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden pb-4">
            <div className="rounded-2xl border border-white/10 bg-[#0f1217] p-3 space-y-3">
              {nav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                    pathname === item.href ? "bg-white/10 text-white" : "text-white/90"
                  } hover:bg-white/5`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/submit-project"
                className="block h-10 rounded-lg bg-[#d61f1f] text-white grid place-items-center text-sm font-bold"
              >
                GET STARTED
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
