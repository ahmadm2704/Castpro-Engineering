"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Briefcase,
  GraduationCap,
  User,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react"
import { supabase, type CareerListing } from "@/lib/supabase"

type UploadedFile = {
  name: string
  size: number
  type: string
  path?: string
}

export default function CareerPage() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [fileObjects, setFileObjects] = useState<{ file: File; meta: UploadedFile }[]>([])
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  // Data state
  const [careerListings, setCareerListings] = useState<CareerListing[]>([])
  const [loadingListings, setLoadingListings] = useState(true)

  // Accepted file types
  const supportedFormats = [
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".rtf",
    ".zip",
    ".rar",
  ] as const

  useEffect(() => {
    ;(async () => {
      setLoadingListings(true)
      try {
        const { data, error } = await supabase
          .from("career_listings")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })

        if (error) throw error
        setCareerListings(data ?? [])
      } catch (err) {
        console.error("Error fetching career listings:", err)
      } finally {
        setLoadingListings(false)
      }
    })()
  }, [])

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files)
  }

  const handleFiles = (fileList: FileList) => {
    const next: { file: File; meta: UploadedFile }[] = []
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i]
      const ext = `.${f.name.split(".").pop()?.toLowerCase() ?? ""}`
      const okType = (supportedFormats as readonly string[]).includes(ext)
      const okSize = f.size <= 10 * 1024 * 1024 // 10MB
      if (okType && okSize) {
        next.push({ file: f, meta: { name: f.name, size: f.size, type: f.type } })
      } else {
        alert(`"${f.name}" not supported or exceeds 10MB.`)
      }
    }
    setFileObjects((prev) => [...prev, ...next])
  }

  const removeFile = (i: number) => {
    setFileObjects((prev) => prev.filter((_, idx) => idx !== i))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  useEffect(() => {
    // Sync files metadata with fileObjects
    setFiles(fileObjects.map((item) => item.meta))
  }, [fileObjects])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus("idle")

    try {
      const appId = crypto.randomUUID()
      const uploadedFiles = await Promise.all(
        fileObjects.map(async ({ file }, index) => {
          const filePath = `applications/${appId}/${file.name}`
          const { data, error: uploadError } = await supabase.storage
            .from("career-applications")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            })

          if (uploadError) throw uploadError

          return { ...fileObjects[index].meta, path: data.path }
        })
      )

      const { error } = await supabase.from("applications").insert([
        {
          ...formData,
          files: uploadedFiles,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) throw error

      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", message: "" })
      setFileObjects([])
    } catch (err) {
      console.error("Submission error:", err)
      setSubmitStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  const jobOpenings = careerListings.filter((l) => l.type === "job")
  const internshipOpenings = careerListings.filter((l) => l.type === "internship")

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO (matches home/services) */}
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
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4 mr-2" />
            Career Opportunities
          </div>
          <h1 className="text-white font-extrabold leading-tight text-[3.2rem] sm:text-[3.8rem] md:text-[5rem] mb-4">
            Join Our{" "}
            <span className="bg-gradient-to-r from-[#d61f1f] to-[#00206d] bg-clip-text text-transparent">
              Team
            </span>
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Shape the future of precision manufacturing with us.
          </p>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loadingListings ? (
            <div className="text-center py-20 text-slate-500">Loading career opportunities…</div>
          ) : (
            <>
              {/* Jobs */}
              <div className="mb-16">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#0e1116]">Current Positions</h2>
                  <p className="text-slate-600 mt-2">We’re hiring across multiple disciplines.</p>
                </div>
                {jobOpenings.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {jobOpenings.map((job) => (
                      <Card key={job.id} className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-[#00206d]">{job.title}</h3>
                          <p className="text-[#d61f1f] text-sm mt-1">
                            {job.type} • {job.location}
                          </p>
                          <p className="text-slate-700 mt-4">{job.description}</p>
                          {!!job.requirements?.length && (
                            <div className="mt-4">
                              <p className="font-medium text-slate-900 mb-1">Requirements</p>
                              <ul className="list-disc list-inside text-slate-700 space-y-1">
                                {job.requirements.map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-600">No job openings at the moment.</p>
                )}
              </div>

              {/* Internships */}
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#0e1116]">Internship Opportunities</h2>
                  <p className="text-slate-600 mt-2">Kickstart your career with hands-on experience.</p>
                </div>
                {internshipOpenings.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {internshipOpenings.map((it) => (
                      <Card key={it.id} className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-[#00206d]">{it.title}</h3>
                          <p className="text-[#d61f1f] text-sm mt-1">
                            {it.type} • {it.location}
                          </p>
                          <p className="text-slate-700 mt-4">{it.description}</p>
                          {!!it.requirements?.length && (
                            <div className="mt-4">
                              <p className="font-medium text-slate-900 mb-1">Requirements</p>
                              <ul className="list-disc list-inside text-slate-700 space-y-1">
                                {it.requirements.map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-600">No internships available right now.</p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-900 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Apply Now
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0e1116] mt-4">
              Submit Your Application
            </h2>
            <p className="text-slate-600 mt-3">
              Attach your CV/resume and any relevant documents.
            </p>
          </div>

          {submitStatus === "success" && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Application submitted!</p>
                    <p className="text-green-700">We’ll review it and get back to you soon.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {submitStatus === "error" && (
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Submission failed</p>
                    <p className="text-red-700">Please try again or check the console for details.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal info */}
            <Card className="border border-slate-200 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="w-6 h-6 text-[#d61f1f]" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-800 mb-2">
                    Full Name *
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
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-800 mb-2">
                    Phone (optional)
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-800 mb-2">
                    Cover Letter / Message (optional)
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us briefly why you’re a great fit…"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upload */}
            <Card className="border border-slate-200 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Upload className="w-6 h-6 text-[#00206d]" />
                  Upload Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
                    dragActive ? "border-[#d61f1f] bg-red-50/40" : "border-slate-300 hover:border-slate-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="font-medium text-slate-900">Drag & drop files here, or click to browse</p>
                  <p className="text-slate-600 text-sm mt-1">Max 10MB per file</p>

                  <input
                    id="file-upload-career"
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    accept={(supportedFormats as readonly string[]).join(",")}
                  />
                  <div className="mt-4">
                    <Button variant="outline" asChild className="border-2">
                      <label htmlFor="file-upload-career" className="cursor-pointer">
                        Browse Files
                      </label>
                    </Button>
                  </div>
                </div>

                {/* Supported formats */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-slate-800 mb-2">Supported formats</p>
                  <div className="flex flex-wrap gap-2">
                    {(supportedFormats as readonly string[]).map((ext) => (
                      <span
                        key={ext}
                        className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>

                {/* File list */}
                {!!files.length && (
                  <div className="mt-6 space-y-3">
                    {files.map((f, i) => (
                      <div
                        key={`${f.name}-${i}`}
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 grid place-items-center">
                            <FileText className="w-5 h-5 text-slate-700" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">{f.name}</p>
                            <p className="text-sm text-slate-600">{formatFileSize(f.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg"
                          aria-label="Remove file"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="h-[54px] px-10 rounded-xl bg-[#d61f1f] hover:bg-[#bf1b1b] text-white"
              >
                {submitting ? "Submitting…" : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Submit Application
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              <p className="text-slate-600 text-sm mt-3">
                We’ll review your application and get back to you as soon as possible.
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}