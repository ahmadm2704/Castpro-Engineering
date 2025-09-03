"use client"

import { useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { LogoMarquee } from "@/components/LogoMarquee"
import TileMarquee from "@/components/TileMarquee"
import {
  Award,
  Users,
  Target,
  Lightbulb,
  Star,
  TrendingUp,
  Shield,
  ArrowRight,
} from "lucide-react"

export default function AboutPage() {
  // marquee tiles auto-scroll
  const stripRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const pauseRef = useRef(false)

  useEffect(() => {
    const el = stripRef.current
    if (!el) return

    const speed = 0.4
    let last: number | null = null

    const step = (t: number) => {
      if (pauseRef.current) {
        last = t
        rafRef.current = requestAnimationFrame(step)
        return
      }
      if (last !== null) {
        const dx = speed * (t - last)
        el.scrollLeft += dx
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
          el.scrollLeft = 0
        }
      }
      last = t
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    const onEnter = () => (pauseRef.current = true)
    const onLeave = () => (pauseRef.current = false)

    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precision",
      description:
        "We maintain the highest standards of accuracy in every project, ensuring your specifications are met exactly.",
      gradient: "from-[#d61f1f] to-[#00206d]",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description:
        "We continuously invest in new technology and R&D to deliver next-level manufacturing solutions.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Client Focus",
      description:
        "Your business goals drive every decision we make. You bring the idea — we execute it flawlessly.",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description:
        "From prototype to production — expect best-in-class QA, workmanship and service.",
      gradient: "from-purple-500 to-pink-500",
    },
  ]

  const achievements = [
    { icon: <Star className="w-6 h-6" />, number: "15+", label: "Years Experience" },
    { icon: <TrendingUp className="w-6 h-6" />, number: "1000+", label: "Projects Completed" },
    { icon: <Users className="w-6 h-6" />, number: "50+", label: "Happy Clients" },
    { icon: <Shield className="w-6 h-6" />, number: "24/7", label: "Support" },
  ]

  const milestones = [
    { year: "2009", title: "Company Founded", description: "Castpro Engineering opens its doors" },
    { year: "2013", title: "First CNC Line Added", description: "Invested heavily in 3-axis machining centers" },
    { year: "2016", title: "Rapid Prototyping Launch", description: "Introduced die & mold and casting services" },
    { year: "2019", title: "ISO 9001 Certified", description: "Achieved global-grade QA certification" },
    { year: "2022", title: "Global Client Base", description: "Trusted by engineering teams across 5 countries" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO section styled like homepage */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero-machine-desktop.jpg"
          muted
          loop
          playsInline
          autoPlay
        />
        <div className="absolute inset-0 bg-[rgba(10,12,16,0.82)]" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-white font-extrabold text-[3.2rem] sm:text-[3.8rem] md:text-[5rem] leading-tight mb-4">
            About <span className="bg-gradient-to-r from-[#d61f1f] to-[#00206d] bg-clip-text text-transparent">Castpro Engineering</span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Turning complex ideas into precision manufactured reality since 2009.
          </p>
        </div>
      </section>

      {/* Auto-marquee tiles */}
      <div className="mt-12 -mb-12">
        <TileMarquee
          items={[
            { src: "/tiles/gear.png", alt: "Gear" },
            { src: "/tiles/perf.png", alt: "Perforated" },
            { src: "/tiles/hook.png", alt: "Hook" },
            { src: "/tiles/housing.png", alt: "Housing" },
            { src: "/tiles/flange.png", alt: "Flange" },
            { src: "/tiles/bracket.png", alt: "Bracket" },
            { src: "/tiles/pin.png", alt: "Pin" },
            { src: "/tiles/pin1.png", alt: "Pin 1" },
          ]}
          className=""
          cardClassName="bg-white/6 border-white/10"
          imgClassName=""
          speed={0.08}
        />
      </div>

      {/* MISSION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6">Our Mission</h2>
              <p className="mb-4 text-gray-700">
                We exist to empower innovators by delivering world-class, end-to-end precision
                manufacturing services across CNC machining, casting, fabrication, and finishing.
              </p>
              <p className="mb-6 text-gray-700">
                From rapid prototyping and functional testing to full-scale production — we’re your
                partner at every stage.
              </p>
              <div className="space-y-3">
                {[
                  "Prototyping to production under one roof",
                  "Unmatched turnaround & consistency",
                  "Engineering-grade QA and traceability",
                  "Always aligned to your success",
                ].map((line, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <span className="w-[10px] h-[10px] inline-block bg-[#d61f1f] rounded-full" />
                    <span className="text-gray-800">{line}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-6">
                {achievements.map((m, i) => (
                  <div key={i} className="rounded-2xl bg-white shadow-lg p-6 text-center hover:shadow-xl transition">
                    <div className="flex justify-center mb-3 text-[#d61f1f]">{m.icon}</div>
                    <div className="text-3xl font-extrabold text-[#00206d]">{m.number}</div>
                    <p className="text-gray-600">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-4xl font-extrabold mb-12 text-[#00206d]">Company Timeline</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[3px] h-full bg-[#d61f1f]/80 rounded-lg" />
            <div className="space-y-10">
              {milestones.map((m, index) => (
                <div key={index} className={`flex items-start ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className="w-1/2 px-4">
                    <div className="rounded-3xl bg-white shadow-lg p-6">
                      <h3 className="text-xl font-bold text-[#00206d] mb-1">{m.title}</h3>
                      <span className="text-sm font-medium text-[#d61f1f]">{m.year}</span>
                      <p className="mt-2 text-gray-600">{m.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d61f1f] border-4 border-white shadow-lg" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-4xl font-extrabold mb-12 text-[#00206d]">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="text-center bg-white shadow-lg rounded-3xl p-8 hover:shadow-xl transition">
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl mb-4 text-white flex items-center justify-center bg-gradient-to-r ${v.gradient}`}
                >
                  {v.icon}
                </div>
                <h4 className="text-lg font-bold text-[#00206d] mb-2">{v.title}</h4>
                <p className="text-gray-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-[28px] sm:text-[32px] font-extrabold text-slate-900">
            Trusted by 100,000+ companies
          </h2>
          <p className="mt-2 text-[16px] text-slate-500">
            59.8% of companies in the Fortune 500 use SendCutSend
          </p>
          <LogoMarquee className="mt-10" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative bg-gradient-to-br from-[#0b0d11] via-[#111318] to-[#171a20] overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#d61f1f]/25 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#00206d]/25 blur-3xl rounded-full" />
        <div className="relative text-center max-w-3xl mx-auto z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
            Ready to Work Together?
          </h2>
          <p className="text-slate-300 mb-10">
            Let’s bring your manufacturing projects to life with precision and quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit-project"
              className="inline-flex items-center justify-center h-[54px] px-10 rounded-xl bg-[#d61f1f] hover:bg-[#bf1b1b] text-white font-semibold"
            >
              Start Your Project
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-[54px] px-10 rounded-xl bg-[#00206d] hover:bg-[#001547] text-white font-semibold"
            >
              Contact Us
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
