"use client"

import { useEffect, useRef } from "react"

type Tile = { src: string; alt?: string }
type Props = {
  items: Tile[]
  className?: string
  cardClassName?: string
  imgClassName?: string
  speed?: number // px per ms
}

export default function TileMarquee({
  items,
  className,
  cardClassName,
  imgClassName,
  speed = 0.08,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const pauseRef = useRef(false)
  const xRef = useRef(0)
  const widthRef = useRef(0)

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track || items.length === 0) return

    const GAP = 20 // matches gap-5

    const measure = () => {
      const children = track.children
      if (!children.length) return
      const half =
        Array.from(children).slice(0, items.length)
          .reduce((acc, el) => acc + (el as HTMLElement).offsetWidth, 0) +
        (items.length - 1) * GAP
      widthRef.current = half
    }
    measure()

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
  }, [items, speed])

  return (
    <div ref={wrapRef} className={`relative overflow-hidden select-none ${className || ""}`}>
      <div
        ref={trackRef}
        className="flex items-center gap-5 will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {[...items, ...items].map((it, i) => (
          <div
            key={`${it.src}-${i}`}
            className={`shrink-0 w-[92px] h-[92px] rounded-2xl grid place-items-center bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-colors ${cardClassName || ""}`}
            title={it.alt || ""}
          >
            <img src={it.src} alt={it.alt || ""} className={`w-10 h-10 object-contain opacity-90 ${imgClassName || ""}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
