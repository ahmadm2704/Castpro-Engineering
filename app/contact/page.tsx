"use client"

import type React from "react"
import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle, Sparkles, Send } from "lucide-react"
import { supabase } from "@/lib/supabase"

const MAP_QUERY = "Castpro Engineering, Rawalpindi, Pakistan (Near GT Road, Industrial Area)"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { error } = await supabase.from("contacts").insert([formData])
      if (error) throw error
      setSubmitStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch (err) {
      console.error("Error submitting contact form:", err)
      setSubmitStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  const contactInfo: Array<{
    icon: React.ReactNode
    title: string
    content: string
    gradient: string
    href?: string
  }> = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      content: "Rawalpindi, Pakistan\nNear GT Road, Industrial Area",
      gradient: "from-[#d61f1f] to-[#00206d]",
      href: `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}`,
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      content: "+92 312 991 0000",
      gradient: "from-[#00206d] to-[#0b2ea2]",
      href: "tel:+923129910000",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "info@castpro.org",
      gradient: "from-[#0b2ea2] to-[#3e6cff]",
      href: "mailto:info@castpro.org",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      content: "Mon–Sat: 8:00–18:00\nSun: Closed",
      gradient: "from-[#d61f1f] to-[#a01515]",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO — matches Home/Services */}
      <section className="relative min-h-[70vh] flex items-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          // src="/videos/hero-machine-desktop.mp4"
          poster="/images/hero-machine-desktop.jpg"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
        <div className="absolute inset-0 bg-[rgba(10,12,16,.82)]" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-white font-extrabold leading-tight text-[3.2rem] sm:text-[3.8rem] md:text-[5rem]">
            Contact{" "}
            <span className="bg-gradient-to-r from-[#d61f1f] to-[#00206d] bg-clip-text text-transparent">
              Our Team
            </span>
          </h1>
          <p className="mt-3 text-white/90 text-lg">
            Let’s build something great together. Reach out now.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, i) => (
              <Card key={i} className="text-center border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition">
                <CardContent className="p-6">
                  <a
                    href={info.href ?? undefined}
                    target={info.href ? "_blank" : undefined}
                    rel={info.href ? "noreferrer" : undefined}
                    className={info.href ? "block focus:outline-none focus:ring-2 focus:ring-[#d61f1f] rounded-xl" : ""}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white mb-4 bg-gradient-to-r ${info.gradient}`}>
                      {info.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{info.title}</h3>
                    <p className="text-slate-600 text-sm whitespace-pre-line">{info.content}</p>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map / actions */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-900 text-sm font-medium mb-6">
                <Phone className="w-4 h-4 mr-2" />
                Contact Information
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0e1116] mb-6">Get in Touch</h2>
              <p className="text-slate-700 mb-8">
                Ready to discuss your manufacturing project? Our team is here to help you bring your ideas
                to life with precision and quality.
              </p>

              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="relative w-full h-80">
                  <iframe
                    title="Castpro Engineering Location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Castpro Engineering</h3>
                    <p className="text-slate-600 text-sm">
                      Rawalpindi, Pakistan — Near GT Road, Industrial Area
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" asChild className="border-2">
                      <a
                        href={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open in Google Maps
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="bg-[#00206d] hover:bg-[#001547] text-white"
                    >
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get Directions
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <Card className="border border-slate-200 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Send className="w-6 h-6 mr-2 text-[#00206d]" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submitStatus === "success" && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-green-800">
                          Message sent successfully! We&apos;ll get back to you soon.
                        </p>
                      </div>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-800">
                          Failed to send message. Please try again.
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-800 mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-800 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-800 mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your project requirements, timeline, and any specific questions you have…"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="w-full h-[54px] rounded-xl bg-[#d61f1f] hover:bg-[#bf1b1b] text-white"
                    >
                      {submitting ? (
                        "Sending…"
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                          <Sparkles className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
