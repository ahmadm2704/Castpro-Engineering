"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  Cog, Wrench, Factory, Hammer, Layers, Zap, Package,
  ArrowRight, CheckCircle, Target
} from "lucide-react"
import TileMarquee from "@/components/TileMarquee"
import { LogoMarquee } from "@/components/LogoMarquee"
import { supabase } from "@/lib/supabase"
import type { JSX } from "react"

type DbService = {
  id: string | number
  title: string
  subtitle?: string | null
  description?: string | null
  features?: string[] | string | null
  applications?: string | null
  icon?: string | null
  gradient?: string | null
  sort_order?: number | null
  is_active?: boolean | null
}

export default function ServicesPage() {
  const [services, setServices] = useState<DbService[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
        if (error) throw error
        setServices((data as DbService[]) || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // icon picker — now safe types
  const getIcon = (name?: string): JSX.Element => {
    const icons: Record<string, JSX.Element> = {
      cog: <Cog className="w-6 h-6" />,
      wrench: <Wrench className="w-6 h-6" />,
      factory: <Factory className="w-6 h-6" />,
      hammer: <Hammer className="w-6 h-6" />,
      layers: <Layers className="w-6 h-6" />,
      zap: <Zap className="w-6 h-6" />,
      package: <Package className="w-6 h-6" />
    }
    // fallback to cog icon
    return icons[name ?? ""] ?? <Cog className="w-6 h-6" />
  }

  const parseFeatures = (v: DbService["features"]) => {
    if (!v) return []
    if (Array.isArray(v)) return v.filter(Boolean) as string[]
    // string case
    return v.split(",").map(x => x.trim()).filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO to match homepage theme */}
      <section className="relative min-h-[70vh] flex items-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero-machine-desktop.jpg"
          muted
          loop
          playsInline
          autoPlay
        />
        <div className="absolute inset-0 bg-[rgba(10,12,16,.82)]" />

        <div className="relative z-10 w-full text-center max-w-4xl mx-auto px-4">
          {/* <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <Target className="w-4 h-4 mr-2" />
            Manufacturing Excellence
          </div> */}
          <h1 className="text-white font-extrabold leading-tight text-[3.2rem] sm:text-[3.8rem] md:text-[5rem] mb-4">
            Our Manufacturing{" "}
            <span className="bg-gradient-to-r from-[#d61f1f] to-[#00206d] bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="mt-2 text-white/90 text-lg max-w-2xl mx-auto">
            Comprehensive manufacturing solutions from concept to production. We combine advanced technology with expert craftsmanship.
          </p>
        </div>
      </section>

      {/* TILE MARQUEE */}
      <div className="mt-12 -mb-16">
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
          cardClassName="bg-white/6 border-white/10"
          speed={0.08}
        />
      </div>

      {/* SERVICES GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-6 rounded-2xl bg-gray-100 animate-pulse"></div>
              ))}
            </div>
          ) : !services.length ? (
            <div className="text-center py-20 text-slate-500">No active services right now.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((srv) => {
                const features = parseFeatures(srv.features)
                const moreCount = Math.max(features.length - 4, 0)

                return (
                  <Card
                    key={srv.id}
                    className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-xl p-3 text-white inline-flex bg-gradient-to-r ${srv.gradient ?? "from-[#d61f1f] to-[#00206d]"}`}>
                          {getIcon(srv.icon ?? undefined)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#00206d]">{srv.title}</h3>
                          {srv.subtitle && <p className="text-sm text-[#d61f1f]">{srv.subtitle}</p>}
                        </div>
                      </div>
                      <div className="my-4 border-t border-dashed border-gray-200"></div>
                      {srv.description && (
                        <p className="text-gray-700 flex-grow" style={{ WebkitLineClamp: 4, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {srv.description}
                        </p>
                      )}
                      {features.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {features.slice(0, 4).map((f, i) => (
                            <span key={i} className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">
                              <CheckCircle className="w-3.5 h-3.5" /> {f}
                            </span>
                          ))}
                          {moreCount > 0 && (
                            <span className="text-xs px-3 py-1 rounded-full border border-gray-200 bg-white">+{moreCount} more</span>
                          )}
                        </div>
                      )}
                      <div className="mt-auto pt-6">
                        <Button asChild className="w-full bg-[#d61f1f] hover:bg-[#bf1b1b]">
                          <Link href="/contact" className="flex items-center justify-center gap-2">
                            Discuss This Service <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* TRUSTED BY
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-[28px] sm:text-[32px] font-extrabold text-slate-900">Trusted Worldwide</h2>
          <p className="mt-2 text-[16px] text-slate-500">59.8% of Fortune 500 companies use our services.</p>
          <LogoMarquee className="mt-10" />
        </div>
      </section> */}

      {/* CTA */}
      <section className="py-24 relative bg-gradient-to-br from-[#0b0d11] via-[#111318] to-[#171a20] overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#d61f1f]/25 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#00206d]/25 blur-3xl rounded-full" />
        <div className="relative max-w-3xl mx-auto text-center z-10">
          <h2 className="text-4xl md:text-5xl text-white font-extrabold mb-5">Ready to Start Your Project?</h2>
          <p className="text-slate-300 mb-10">Let’s partner on your next product or prototype.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit-project" className="inline-flex items-center justify-center h-[52px] px-10 rounded-xl bg-[#d61f1f] hover:bg-[#bf1b1b] text-white font-semibold">Submit Your Project</Link>
            <Link href="/contact" className="inline-flex items-center justify-center h-[52px] px-10 rounded-xl bg-[#00206d] hover:bg-[#001547] text-white font-semibold">Contact Our Team <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
