
"use client"
import { useEffect, useRef } from "react"
import clsx from "clsx"

type Props = { className?: string }

export function LogoMarquee({ className }: Props) {
  // Edit logos as needed (SVG/PNG in /public/logos)
  const logos = [
    "/logos/waymo.svg",
    "/logos/google.svg",
    "/logos/siemens.svg",
    "/logos/starfish-space.svg",
    "/logos/regal.svg",
    "/logos/stealth-ev.svg",
  ]

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const pauseRef = useRef(false)
  const xRef = useRef(0)
  const widthRef = useRef(0)

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return

    // Measure width of one sequence
    const measure = () => {
      // track has duplicated content: [logos][logos]
      const children = track.children
      if (!children.length) return
      const firstHalfWidth =
        Array.from(children)
          .slice(0, logos.length)
          .reduce((acc, el) => acc + (el as HTMLElement).offsetWidth, 0) +
        (logos.length - 1) * 56 // gap-x (14 * 4) = 56px; keep in sync with class below
      widthRef.current = firstHalfWidth
    }
    measure()

    const speed = 0.08 // px per ms (tweak for faster/slower)
    let last: number | null = null

    const step = (t: number) => {
      if (pauseRef.current) {
        last = t
        rafRef.current = requestAnimationFrame(step)
        return
      }
      if (last != null) {
        const dt = t - last
        xRef.current -= speed * dt
        // When one sequence fully scrolled, reset for seamless loop
        if (Math.abs(xRef.current) >= widthRef.current) xRef.current = 0
        track.style.transform = `translate3d(${xRef.current}px,0,0)`
      }
      last = t
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    const onEnter = () => (pauseRef.current = true)
    const onLeave = () => (pauseRef.current = false)

    wrap.addEventListener("mouseenter", onEnter)
    wrap.addEventListener("mouseleave", onLeave)
    wrap.addEventListener("touchstart", onEnter, { passive: true })
    wrap.addEventListener("touchend", onLeave)
    window.addEventListener("resize", measure)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      wrap.removeEventListener("mouseenter", onEnter)
      wrap.removeEventListener("mouseleave", onLeave)
      wrap.removeEventListener("touchstart", onEnter)
      wrap.removeEventListener("touchend", onLeave)
      window.removeEventListener("resize", measure)
    }
  }, [logos.length])

  return (
    <div
      ref={wrapRef}
      className={clsx(
        "relative overflow-hidden select-none",
        className
      )}
      aria-label="Companies that trust us"
    >
      <div
        ref={trackRef}
        className="flex items-center gap-14 will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {/* Duplicate sequence for seamless loop */}
        {[...logos, ...logos].map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            className="h-8 opacity-90"
            draggable={false}
          />
        ))}
      </div>
    </div>
  )
}
