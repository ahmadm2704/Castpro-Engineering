"use client"

import type React from "react"



import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, AlertCircle, X, Sparkles, Target } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface UploadedFile {
  file: File
  name: string
  size: number
  type: string
}


export default function SubmitProjectPage() {
const [particles, setParticles] = useState<React.ReactElement[] | null>(null)

useEffect(() => {
  const generated = [...Array(8)].map((_, i) => {
    const top = `${Math.random() * 100}%`
    const left = `${Math.random() * 100}%`
    return <div key={i} className="particle" style={{ top, left }} />
  })
  setParticles(generated)
}, [])


const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "", // ← add this line
  company: "",
  project_description: "",
})

  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")

  const supportedFormats = [
    ".zip",
    ".prt",
    ".dxf",
    ".pdf",
    ".step",
    ".igs",
    ".stl",
    ".sldprt",
    ".dwg",
    ".rar",
    ".3dm",
    ".x_t",
    ".catpart",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

const handleFiles = (fileList: FileList) => {
  const newFiles: UploadedFile[] = []

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

    if (supportedFormats.includes(fileExtension) || file.size <= 50 * 1024 * 1024) {
      newFiles.push({
        file, // ✅ Include full File object
        name: file.name,
        size: file.size,
        type: file.type,
      })
    }
  }

  setFiles((prev) => [...prev, ...newFiles])
}


  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setUploading(true)

  try {
    const uploadedFiles: any[] = []

    for (const f of files) {
      const fileName = `projects/${Date.now()}-${f.name}`
      const { data, error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(fileName, f.file)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from("project-files")
        .getPublicUrl(fileName)

      uploadedFiles.push({
        name: f.name,
        size: f.size,
        type: f.type,
        path: data?.path,
        url: publicUrlData.publicUrl,
      })
    }

    const { error } = await supabase.from("projects").insert([
      {
        ...formData,
        files: uploadedFiles,
      },
    ])

    if (error) throw error

    setUploadStatus("success")
    setFormData({ name: "", email: "", phone: "", company: "", project_description: "" })
    setFiles([])
  } catch (error) {
    console.error("Error submitting project:", error)
    setUploadStatus("error")
  } finally {
    setUploading(false)
  }
}


  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 py-20 bg-gradient-to-br from-secondary-900 via-accent-900 to-primary-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Floating Particles */}
{particles && (
  <div className="particles">
    {particles}
  </div>
)}





        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="slide-up">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
              <Target className="w-4 h-4 mr-2" />
              Project Submission
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl text-white mb-6">
              Submit Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Project
              </span>
            </h1>
            <p className="text-xl text-gray-200">
              Upload your design files and project requirements to receive a detailed quote within 24 hours
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {uploadStatus === "success" && (
            <Card className="mb-8 border-green-200 bg-green-50 glass-card slide-up">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Project Submitted Successfully!</h3>
                    <p className="text-green-700">We'll review your project and get back to you within 24 hours.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadStatus === "error" && (
            <Card className="mb-8 border-red-200 bg-red-50 glass-card slide-up">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">Submission Failed</h3>
                    <p className="text-red-700">There was an error submitting your project. Please try again.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <Card className="glass-card border-0 shadow-xl scale-in">
              <CardHeader>
                <CardTitle className="text-2xl font-display flex items-center">
                  <Upload className="w-6 h-6 mr-2 text-primary-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-accent-700 mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border-2 focus:border-primary-500 transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-accent-700 mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border-2 focus:border-primary-500 transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-accent-700 mb-2">
                    Company (Optional)
                  </label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full border-2 focus:border-primary-500 transition-all duration-300"
                    placeholder="Your company name"
                  />
                </div>
                <div>
  <label htmlFor="phone" className="block text-sm font-medium text-accent-700 mb-2">
    Phone / WhatsApp Number *
  </label>
  <Input
    id="phone"
    name="phone"
    type="tel"
    required
    value={formData.phone}
    onChange={handleInputChange}
    className="w-full border-2 focus:border-primary-500 transition-all duration-300"
    placeholder="+92XXXXXXXXXX"
  />
</div>

              </CardContent>
            </Card>

            {/* Project Description */}
            <Card className="glass-card border-0 shadow-xl scale-in" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle className="text-2xl font-display flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-secondary-600" />
                  Project Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label htmlFor="project_description" className="block text-sm font-medium text-accent-700 mb-2">
                  Describe your project requirements, materials, quantities, and timeline *
                </label>
                <Textarea
                  id="project_description"
                  name="project_description"
                  required
                  rows={6}
                  value={formData.project_description}
                  onChange={handleInputChange}
                  className="w-full border-2 focus:border-primary-500 transition-all duration-300"
                  placeholder="Please provide details about your project including materials, quantities, tolerances, timeline, and any special requirements..."
                />
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="glass-card border-0 shadow-xl scale-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="text-2xl font-display flex items-center">
                  <Upload className="w-6 h-6 mr-2 text-green-600" />
                  Upload Design Files
                </CardTitle>
                <p className="text-accent-600 mt-2">
                  We accept NDA-protected files. Your intellectual property is fully secured.
                </p>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover-lift ${
                    dragActive
                      ? "border-primary-500 bg-primary-50 scale-105"
                      : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="floating mb-4">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                  </div>
                  <p className="text-lg font-medium text-accent-900 mb-2">
                    Drag and drop your files here, or click to browse
                  </p>
                  <p className="text-accent-600 mb-4">Maximum file size: 50MB per file</p>
<input
  type="file"
  multiple
  onChange={handleFileInput}
  className="hidden"
  id="file-upload"
/>



                  <Button
                    type="button"
                    variant="outline"
                    className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white hover:scale-105 transition-all duration-300 bg-transparent"
                    asChild
                  >
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Browse Files
                    </label>
                  </Button>
                </div>

                {/* Supported Formats */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-accent-700 mb-3">Supported Formats:</p>
                  <div className="flex flex-wrap gap-2">
                    {supportedFormats.map((format, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 text-xs rounded-full font-medium"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Uploaded Files */}
                {files.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-accent-900 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-primary-600" />
                      Uploaded Files ({files.length}):
                    </h4>
                    <div className="space-y-3">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-primary-200 transition-all duration-300 hover-lift"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-accent-900">{file.name}</p>
                              <p className="text-sm text-accent-600">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center scale-in" style={{ animationDelay: "0.3s" }}>
              <Button
                type="submit"
                size="lg"
                disabled={uploading}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 hover:scale-105 transition-all duration-300 px-12 py-4 text-lg shadow-xl"
              >
                {uploading ? (
                  <>
                    <div className="loading-dots mr-2">
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                    </div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Submit Project
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              <p className="text-sm text-accent-600 mt-4">
                We'll review your submission and respond within 24 hours with a detailed quote.
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
