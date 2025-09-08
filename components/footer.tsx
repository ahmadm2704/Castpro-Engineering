import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#0c0f14] text-slate-200 mt-20">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/images/castpro-logo.png"
                alt="Castpro Engineering"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="font-extrabold text-lg tracking-tight">Castpro Engineering</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Precision-manufactured parts delivered at scale. CNC machining, die casting, fabrication, and
              rapid-turn production — engineered for quality and speed.
            </p>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[var(--brand-400)]" /> Rawalpindi, Pakistan — Near GT Road,
                Industrial Area
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[var(--brand-400)]" />
                <a href="tel:+923129910000" className="hover:text-white">
                  +92 312 9910000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[var(--brand-400)]" />
                <a href="mailto:info@castpro.org" className="hover:text-white">
                  info@castpro.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[var(--brand-400)]" /> Mon–Sat: 8AM–6PM · Sun: Closed
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              {[
                "CNC Machining",
                "Die & Mold Manufacturing",
                "Die Casting",
                "Metal Fabrication",
                "Extrusion",
                "Rapid Prototyping",
              ].map((label) => (
                <li key={label}>
                  <Link href="/services" className="hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/career" className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/submit-project" className="hover:text-white">
                  Submit Project
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Castpro Engineering. All rights reserved.
          </p>
          <div className="hidden md:block h-px flex-1 max-w-[40%] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        </div>
      </div>
    </footer>
  )
}
