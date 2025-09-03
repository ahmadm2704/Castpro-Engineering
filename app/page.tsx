"use client"

import { useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { LogoMarquee } from "@/components/LogoMarquee"
import  TileMarquee   from "@/components/TileMarquee"



export default function HomePage() {
  // ----- Auto sliding tiles -----
  const stripRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const pauseRef = useRef(false)

  useEffect(() => {
    const el = stripRef.current
    if (!el) return

    const speed = 0.4 // px per ms
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
        // loop illusion
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
    el.addEventListener("touchstart", onEnter, { passive: true })
    el.addEventListener("touchend", onLeave)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
      el.removeEventListener("touchstart", onEnter)
      el.removeEventListener("touchend", onLeave)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center">
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          //src="/videoss/hero-machine-desktop.mp4"
          poster="/images/hero-machine-desktop.jpg"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,16,.82),rgba(10,12,16,.82))]" />

        {/* Content */}
        <div className="relative z-10 w-full">
          <div className="max-w-[1200px] mx-auto px-4 pt-28 md:pt-24 pb-16 text-center">
            <h1 className="text-white font-extrabold tracking-[-0.02em] leading-[0.92] text-[3.2rem] sm:text-[3.8rem] md:text-[5.1rem]">
              Custom parts
              <br className="hidden sm:block" />
              delivered in as little
              <br className="hidden sm:block" />
              as <span className="whitespace-nowrap">2 days.</span>
            </h1>

            <p className="mt-6 text-white/90 text-[20px] sm:text-[22px]">
              Sheet metal fabrication, CNC machining, and much more.
            </p>

            <div className="mt-8 flex items-center justify-center">
              <Link
                href="/submit-project"
                className="h-[64px] px-8 rounded-2xl bg-[var(--brand-accent,#e53935)] hover:bg-[#c92f2f] text-white text-[18px] font-extrabold inline-flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,.35)]"
              >
                GET STARTED
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="ml-2"
                >
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            <p className="mt-8 text-white/80 text-[16px]">
              Whatever you’re building we’ve got you. No CAD? Start with a{" "}
              <Link
                href="/templates"
                className="underline decoration-white/70 underline-offset-2 hover:decoration-white"
              >
                template
              </Link>{" "}
              or send a{" "}
              <Link
                href="/contact"
                className="underline decoration-white/70 underline-offset-2 hover:decoration-white"
              >
                sketch
              </Link>
              .
            </p>

{/* Auto-sliding tile strip */}
<div className="mt-10 -mb-6">
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
    cardClassName="bg-white/6 border-white/10"   // matches your screenshot
    imgClassName=""
    speed={0.08}                                  // tweak if you want faster/slower
  />
</div>

          </div>
        </div>
      </section>

      {/* other sections go here */}

      {/* QUICK SERVICES GRID */}
<section className="py-16">
  <div className="max-w-[1200px] mx-auto px-4">
    <h2 className="text-center text-[28px] md:text-[32px] font-extrabold text-slate-800 mb-8">
      Everything you need in just a few clicks.
    </h2>

    {(() => {
      const items = [
        {
          img: "/services/precision-cutting.png",
          title: "Precision Cutting",
          desc:
            "Laser cutting, waterjet, and CNC routing for sheet materials.",
          href: "/services/precision-cutting",
        },
        {
          img: "/services/cnc-machining.png",
          title: "CNC Machining",
          desc:
            "Multiaxis CNC machining in billet stock.",
          href: "/services/cnc-machining",
        },
        {
          img: "/services/bending.png",
          title: "Bending",
          desc:
            "Bends within 1 degree of accuracy or better.",
          href: "/services/bending",
        },
        {
          img: "/services/countersinking.png",
          title: "Countersinking",
          desc:
            "Allow hardware to sit flush on your parts to reduce wear and tear.",
          href: "/services/countersinking",
        },
        {
          img: "/services/dimple-forming.png",
          title: "Dimple Forming",
          desc:
            "Reinforce and enhance your parts with dimples up to 3\".",
          href: "/services/dimple-forming",
        },
        {
          img: "/services/hardware-insertion.png",
          title: "Hardware insertion",
          desc:
            "Add strong, permanent fasteners to your metal parts.",
          href: "/services/hardware-insertion",
        },
        {
          img: "/services/tapping.png",
          title: "Tapping",
          desc:
            "Easily add threading to allow for the addition of hardware to your parts.",
          href: "/services/tapping",
        },
        {
          img: "/services/anodizing.png",
          title: "Anodizing",
          desc:
            "Increase durability with Class II anodizing services available in 5 colors.",
          href: "/services/anodizing",
        },
        {
          img: "/services/deburring.png",
          title: "Deburring",
          desc:
            "Smooth sharp edges and clean up your metal parts.",
          href: "/services/deburring",
        },
        {
          img: "/services/plating.png",
          title: "Plating",
          desc:
            "Increase rust prevention, wear resistance, and strength with zinc and nickel plating.",
          href: "/services/plating",
        },
        {
          img: "/services/powder-coating.png",
          title: "Powder Coating",
          desc:
            "Give your custom cut parts a bold, long-lasting protective layer in one of 10 options.",
          href: "/services/powder-coating",
        },
        {
          img: "/services/tumbling.png",
          title: "Tumbling",
          desc:
            "Reduce the surface blemishes and handling scratches found in raw materials.",
          href: "/services/tumbling",
        },
      ]

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((it) => (
            <a
              key={it.title}
              href={it.href}
              className="rounded-2xl bg-slate-100/70 border border-slate-200 hover:border-slate-300 p-5 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            >
              <div className="h-[84px] w-full grid place-items-center mb-3">
                {/* Replace with next/image if you prefer */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.img}
                  alt={it.title}
                  className="h-[72px] w-auto object-contain select-none"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-[13px] font-extrabold text-slate-800">
                  {it.title}
                </h3>
                <p className="text-[12px] leading-snug text-slate-600">
                  {it.desc}
                </p>
              </div>

              {/* tiny arrow link */}
              <div className="mt-3">
                <span className="inline-flex items-center text-[12px] font-semibold text-sky-700">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mr-1"
                  >
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Learn more
                </span>
              </div>
            </a>
          ))}
        </div>
      )
    })()}

{/* Bottom CTAs */}
<div className="mt-8 flex items-center justify-center gap-4">
  <Link
    href="/services"
    className="px-6 h-[46px] inline-flex items-center justify-center rounded-[12px] border border-[#0b1d37] bg-white text-[#0b1d37] font-bold text-[14px] tracking-wide hover:bg-[#0b1d37] hover:text-white transition-colors"
  >
    VIEW ALL SERVICES
  </Link>

  <Link
    href="/submit-project"
    className="px-6 h-[46px] inline-flex items-center justify-center rounded-[12px] bg-[#e53935] text-white font-bold text-[14px] tracking-wide hover:bg-[#c92f2f] transition-colors"
  >
    GET STARTED
  </Link>
</div>


  </div>
</section>


{/* TRUSTED BY — auto slider */}
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


{/* PRICING EXAMPLES (transparent BG) */}
<section className="mt-24 pb-20">
  <div className="max-w-[1200px] mx-auto px-4">
    <h2 className="text-center text-[32px] font-extrabold text-slate-900 pt-14">
      Laser cut sheet metal pricing examples
    </h2>
    <p className="mt-2 text-center text-[15px] max-w-2xl mx-auto text-slate-600">
      Browse sample parts to understand how size, material, and design density affect your overall part cost.
    </p>

    <div className="mt-14 flex flex-col gap-16">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-14">
        <img src="/pricing/aluminum-part.png" alt="5052 Aluminum Example" className="w-[390px] mx-auto object-contain"/>
        <div className="rounded-[28px] bg-white shadow-xl p-10 max-w-[420px] mx-auto">
          <h3 className="font-bold text-[20px] tracking-tight mb-1">5052 Aluminum .187"</h3>
          <p className="text-[13px] text-slate-500">Size: 3.6 × 2.5"</p>
          <p className="text-[13px] text-slate-500">Laser Cutting, Deburring</p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-14">
        <img src="/pricing/copper-part.png" alt="Copper Example" className="w-[390px] mx-auto object-contain md:order-2"/>
        <div className="rounded-[28px] bg-white shadow-xl p-10 max-w-[420px] mx-auto md:order-1">
          <h3 className="font-bold text-[20px] tracking-tight mb-1">Copper .063"</h3>
          <p className="text-[13px] text-slate-500">Size: 1.4 × 5.2"</p>
          <p className="text-[13px] text-slate-500">Laser Cutting, Deburring</p>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-14">
        <img src="/pricing/delrin-part.png" alt="Delrin Example" className="w-[390px] mx-auto object-contain"/>
        <div className="rounded-[28px] bg-white shadow-xl p-10 max-w-[420px] mx-auto">
          <h3 className="font-bold text-[20px] tracking-tight mb-1">Delrin .270"</h3>
          <p className="text-[13px] text-slate-500">Size: 2.6 × 2.9"</p>
          <p className="text-[13px] text-slate-500">CNC Routing, Tapping</p>
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-14">
        <img src="/pricing/carbonfiber-part.png" alt="Carbon Fiber Example" className="w-[390px] mx-auto object-contain md:order-2"/>
        <div className="rounded-[28px] bg-white shadow-xl p-10 max-w-[420px] mx-auto md:order-1">
          <h3 className="font-bold text-[20px] tracking-tight mb-1">Carbon Fiber .039"</h3>
          <p className="text-[13px] text-slate-500">Size: 6.7 × 4.25"</p>
          <p className="text-[13px] text-slate-500">Waterjet Cutting</p>
        </div>
      </div>
    </div>
  </div>
</section>









      <Footer />
    </div>
  )
}
