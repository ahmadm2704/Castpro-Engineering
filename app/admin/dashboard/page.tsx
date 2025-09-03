"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LayoutDashboard,
  FileText,
  Settings,
  Upload,
  Eye,
  Trash2,
  Edit,
  LogOut,
  Search,
  Users,
  Mail,
  Plus,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Send,
  RefreshCw,
  Briefcase,
  GraduationCap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  supabase,
  type Project,
  type Contact,
  type Service,
  type CareerListing,
  type Application,
} from "@/lib/supabase"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [projects, setProjects] = useState<Project[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [careerListings, setCareerListings] = useState<CareerListing[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [isCareerListingDialogOpen, setIsCareerListingDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingCareerListing, setEditingCareerListing] = useState<CareerListing | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const results = await Promise.allSettled([
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("contacts").select("*").order("created_at", { ascending: false }),
        supabase.from("services").select("*").order("sort_order"),
        supabase.from("career_listings").select("*").order("created_at", { ascending: false }),
        supabase.from("applications").select("*").order("created_at", { ascending: false }), // NEW
      ])

      // projects
      if (results[0].status === "fulfilled") {
        const { data, error } = results[0].value
        if (error) console.error("Projects fetch error:", error)
        setProjects(data ?? [])
      } else {
        console.error("Projects fetch failed:", results[0].reason)
      }

      // contacts
      if (results[1].status === "fulfilled") {
        const { data, error } = results[1].value
        if (error) console.error("Contacts fetch error:", error)
        setContacts(data ?? [])
      } else {
        console.error("Contacts fetch failed:", results[1].reason)
      }

      // services
      if (results[2].status === "fulfilled") {
        const { data, error } = results[2].value
        if (error) console.error("Services fetch error:", error)
        setServices(data ?? [])
      } else {
        console.error("Services fetch failed:", results[2].reason)
      }

      // career listings
      if (results[3].status === "fulfilled") {
        const { data, error } = results[3].value
        if (error) console.error("Career listings fetch error:", error)
        setCareerListings(data ?? [])
      } else {
        console.error("Career listings fetch failed:", results[3].reason)
      }

      // applications
      if (results[4].status === "fulfilled") {
        const { data, error } = results[4].value
        if (error) {
          console.error("Applications fetch error:", error)
        } else {
          setApplications((data ?? []) as Application[])
        }
      } else {
        console.error("Applications fetch failed:", results[4].reason)
      }
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.company && project.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "quoted":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="w-4 h-4" />
      case "reviewed":
        return <Eye className="w-4 h-4" />
      case "quoted":
        return <FileText className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleLogout = () => {
    window.location.href = "/admin"
  }

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", projectId)
      if (error) throw error
      await fetchData()
    } catch (error) {
      console.error("Error updating project status:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setLoading(true)
      try {
        const { error } = await supabase.from("projects").delete().eq("id", projectId)
        if (error) throw error
        await fetchData()
      } catch (error) {
        console.error("Error deleting project:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("contacts")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", contactId)
      if (error) throw error
      await fetchData()
    } catch (error) {
      console.error("Error updating contact status:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteContact = async (contactId: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setLoading(true)
      try {
        const { error } = await supabase.from("contacts").delete().eq("id", contactId)
        if (error) throw error
        await fetchData()
      } catch (error) {
        console.error("Error deleting contact:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target as HTMLFormElement
    const title = (form.elements.namedItem("title") as HTMLInputElement).value
    const subtitle = (form.elements.namedItem("subtitle") as HTMLInputElement).value
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value
    const features = (form.elements.namedItem("features") as HTMLTextAreaElement).value
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f)
    const isActive = (form.elements.namedItem("active") as HTMLInputElement).checked

    try {
      if (editingService) {
        const { error } = await supabase
          .from("services")
          .update({ title, subtitle, description, features, is_active: isActive, updated_at: new Date().toISOString() })
          .eq("id", editingService.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("services")
          .insert([{ title, subtitle, description, features, is_active: isActive }])
        if (error) throw error
      }
      setIsServiceDialogOpen(false)
      setEditingService(null)
      await fetchData()
    } catch (error) {
      console.error("Error saving service:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteService = async (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setLoading(true)
      try {
        const { error } = await supabase.from("services").delete().eq("id", serviceId)
        if (error) throw error
        await fetchData()
      } catch (error) {
        console.error("Error deleting service:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCareerListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target as HTMLFormElement
    const title = (form.elements.namedItem("title") as HTMLInputElement).value
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value as "job" | "internship"
    const location = (form.elements.namedItem("location") as HTMLInputElement).value
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value
    const requirements = (form.elements.namedItem("requirements") as HTMLTextAreaElement).value
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r)
    const isActive = (form.elements.namedItem("active") as HTMLInputElement).checked

    try {
      if (editingCareerListing) {
        const { error } = await supabase
          .from("career_listings")
          .update({
            title,
            type,
            location,
            description,
            requirements,
            is_active: isActive,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCareerListing.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("career_listings")
          .insert([{ title, type, location, description, requirements, is_active: isActive }])
        if (error) throw error
      }
      setIsCareerListingDialogOpen(false)
      setEditingCareerListing(null)
      await fetchData()
    } catch (error) {
      console.error("Error saving career listing:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCareerListing = async (listingId: string) => {
    if (confirm("Are you sure you want to delete this career listing?")) {
      setLoading(true)
      try {
        const { error } = await supabase.from("career_listings").delete().eq("id", listingId)
        if (error) throw error
        await fetchData()
      } catch (error) {
        console.error("Error deleting career listing:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // // --- NEW: signed URL helper for application files
  // const downloadApplicationFile = async (path: string, filename?: string) => {
  //   const { data, error } = await supabase.storage
  //     .from("career-applications")
  //     .createSignedUrl(path, 60 * 60) // 1 hour
  //   if (error || !data?.signedUrl) {
  //     console.error("Signed URL error:", error)
  //     alert("Could not generate a download link. Check your storage policies.")
  //     return
  //   }
  //   // open in new tab (or you can create an <a download> programmatically)
  //   window.open(data.signedUrl, "_blank", "noopener,noreferrer")
  // }
  
  // Safer downloader (keeps your bucket name)
// --- replace your current download helper with this:
// --- helpers: download app file ---
// Download helper that supports path, key/objectKey, or url
const downloadApplicationFile = async (file: any) => {
  // Extract possible path or URL properties
  const path = (file?.path ?? file?.key ?? file?.objectKey)?.replace(/^\/+/, "") || "";
  const url = file?.url as string | undefined;
  const filename = file?.name || path.split("/").pop() || "attachment";

  if (!path && !url) {
    alert("No file path or URL available for download.");
    console.log("File object missing path/url:", file);
    return;
  }

  try {
    if (url) {
      // If URL is available, open it directly
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    // Generate signed URL if path is available
    const { data: signed, error: signedError } = await supabase.storage
      .from("career-applications")
      .createSignedUrl(path, 60 * 60); // 1 hour expiration

    if (signedError || !signed?.signedUrl) {
      throw new Error("Failed to generate signed URL");
    }

    window.open(signed.signedUrl, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Download error:", error);
    alert("Could not download the file. Check the console for details.");
  }
};





// --- add this (delete entire application: storage files + DB row)
const deleteApplication = async (app: Application) => {
  if (!confirm("Delete this application and its files?")) return;

  try {
    // remove files from storage
    const filePaths = (app.files ?? []).map((f: any) => f.path).filter(Boolean);
    if (filePaths.length) {
      const { error: rmErr } = await supabase
        .storage
        .from("career-applications")
        .remove(filePaths);
      if (rmErr) console.error("Storage remove error:", rmErr);
    }

    // remove row
    const { error: rowErr } = await supabase
      .from("applications")
      .delete()
      .eq("id", app.id);
    if (rowErr) throw rowErr;

    await fetchData();
  } catch (e) {
    console.error("Delete application error:", e);
    alert("Failed to delete application. Check policies & console.");
  }
};


// --- add this (optional: delete a single file from an application)
const deleteApplicationFileFromRow = async (appId: string, path: string) => {
  if (!confirm("Delete this file?")) return
  setLoading(true)
  try {
    const { error: rmErr } = await supabase.storage
      .from("career-applications")
      .remove([path])
    if (rmErr) throw rmErr

    const app = applications.find((a) => a.id === appId)
    if (!app) throw new Error("Application not found in state")

    const newFiles = (app.files ?? []).filter((f: any) => f?.path !== path)
    const { error: upErr } = await supabase
      .from("applications")
      .update({ files: newFiles, updated_at: new Date().toISOString() })
      .eq("id", appId)
    if (upErr) throw upErr

    await fetchData()
  } catch (err) {
    console.error("Error deleting file from application:", err)
    alert("Could not delete file. See console for details.")
  } finally {
    setLoading(false)
  }
}





  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-0 shadow-xl hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-accent-600">Total Projects</p>
                <p className="text-3xl font-bold text-gradient">{projects.length}</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-xl hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-accent-600">New Submissions</p>
                <p className="text-3xl font-bold text-gradient">{projects.filter((p) => p.status === "new").length}</p>
                <p className="text-xs text-blue-600 mt-1">Needs attention</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-xl hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-accent-600">Contact Messages</p>
                <p className="text-3xl font-bold text-gradient">{contacts.length}</p>
                <p className="text-xs text-green-600 mt-1">
                  {contacts.filter((c) => c.status === "new").length} unread
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-xl hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-accent-600">Active Services</p>
                <p className="text-3xl font-bold text-gradient">{services.filter((s) => s.is_active).length}</p>
                <p className="text-xs text-purple-600 mt-1">All systems operational</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              Recent Projects
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActiveTab("projects")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedProject(project)
                    setIsProjectDialogOpen(true)
                  }}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-accent-900">{project.name}</h4>
                    <p className="text-sm text-accent-600">
                      {project.company && `${project.company} • `}
                      {project.email}
                    </p>
                    <p className="text-xs text-accent-500 mt-1">{formatDate(project.created_at)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(project.status)} border`}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-green-600" />
              Recent Messages
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActiveTab("contacts")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.slice(0, 3).map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start justify-between p-4 border rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedContact(contact)
                    setIsContactDialogOpen(true)
                  }}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-accent-900">{contact.name}</h4>
                    <p className="text-sm text-accent-600">{contact.email}</p>
                    <p className="text-sm text-accent-700 mt-2 line-clamp-2">{contact.message}</p>
                    <p className="text-xs text-accent-500 mt-2">{formatDate(contact.created_at)}</p>
                  </div>
                  <Badge
                    className={contact.status === "new" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}
                  >
                    {contact.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 focus:border-primary-500 transition-all duration-300"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="quoted">Quoted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="glass-card border-0 shadow-xl hover-lift">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-accent-900">{project.name}</h3>
                    <Badge className={`${getStatusColor(project.status)} border`}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status}</span>
                    </Badge>
                  </div>
                  <p className="text-accent-600 mb-1">
                    {project.company && `${project.company} • `}
                    {project.email}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-accent-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Submitted: {formatDate(project.created_at)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Updated: {formatDate(project.updated_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={project.status} onValueChange={(value) => updateProjectStatus(project.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-accent-900 mb-2">Project Description:</h4>
                <p className="text-accent-600 bg-gray-50 p-3 rounded-lg">{project.project_description}</p>
              </div>

              {project.files && project.files.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-accent-900 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Files ({project.files.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {project.files.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 bg-white p-3 rounded-lg border hover:shadow-md transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-accent-900 truncate">{file.name}</p>
                          <p className="text-sm text-accent-500">{formatFileSize(file.size)}</p>
                        </div>
                        <a href={file.url} download={file.name}>
                          <Button size="sm" variant="ghost" className="hover:bg-primary-50">
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedProject(project)
                    setIsProjectDialogOpen(true)
                  }}
                  className="hover:scale-105 transition-all duration-300 bg-transparent"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:scale-105 transition-all duration-300 bg-transparent"
                  onClick={() => deleteProject(project.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-accent-900 flex items-center">
          <Mail className="w-6 h-6 mr-2 text-green-600" />
          Contact Messages
        </h2>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {contacts.map((contact) => (
          <Card key={contact.id} className="glass-card border-0 shadow-xl hover-lift">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-accent-900">{contact.name}</h3>
                    <Badge
                      className={
                        contact.status === "new"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      }
                    >
                      {contact.status === "new" ? (
                        <AlertCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {contact.status}
                    </Badge>
                  </div>
                  <p className="text-accent-600 mb-2">{contact.email}</p>
                  <p className="text-sm text-accent-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Received: {formatDate(contact.created_at)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={contact.status} onValueChange={(value) => updateContactStatus(contact.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-accent-900 mb-3">Message:</h4>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">
                  <p className="text-accent-600 leading-relaxed">{contact.message}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedContact(contact)
                    setIsContactDialogOpen(true)
                  }}
                  className="hover:scale-105 transition-all duration-300 bg-transparent"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="hover:scale-105 transition-all duration-300 bg-transparent">
                  <Send className="w-4 h-4 mr-1" />
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:scale-105 transition-all duration-300 bg-transparent"
                  onClick={() => updateContactStatus(contact.id, "responded")}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Responded
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:scale-105 transition-all duration-300 bg-transparent"
                  onClick={() => deleteContact(contact.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-accent-900 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-purple-600" />
          Manage Services
        </h2>
        <Button
          className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 hover:scale-105 transition-all duration-300"
          onClick={() => {
            setEditingService(null)
            setIsServiceDialogOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-6">
        {services.map((service) => (
          <Card key={service.id} className="glass-card border-0 shadow-xl hover-lift">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-accent-900">{service.title}</h3>
                    <Badge
                      className={
                        service.is_active
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {service.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {service.subtitle && <p className="text-primary-600 font-medium mb-2">{service.subtitle}</p>}
                  <p className="text-accent-600 mb-4">{service.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingService(service)
                      setIsServiceDialogOpen(true)
                    }}
                    className="hover:scale-105 transition-all duration-300 bg-transparent"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:scale-105 transition-all duration-300 bg-transparent"
                    onClick={() => deleteService(service.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              {service.features && service.features.length > 0 && (
                <div>
                  <h4 className="font-medium text-accent-900 mb-3">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary-100 text-primary-800">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderCareers = () => (
    <div className="space-y-10">
      {/* Listings header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-accent-900 flex items-center">
          <Briefcase className="w-6 h-6 mr-2 text-orange-600" />
          Manage Career Listings
        </h2>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchData}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 hover:scale-105 transition-all duration-300"
            onClick={() => {
              setEditingCareerListing(null)
              setIsCareerListingDialogOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
        </div>
      </div>

      {/* Listings grid */}
      <div className="grid gap-6">
        {careerListings.map((listing) => (
          <Card key={listing.id} className="glass-card border-0 shadow-xl hover-lift">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-accent-900">{listing.title}</h3>
                    <Badge
                      className={
                        listing.type === "job"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-purple-100 text-purple-800 border-purple-200"
                      }
                    >
                      {listing.type === "job" ? (
                        <Briefcase className="w-4 h-4 mr-1" />
                      ) : (
                        <GraduationCap className="w-4 h-4 mr-1" />
                      )}
                      {listing.type}
                    </Badge>
                    <Badge
                      className={
                        listing.is_active
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {listing.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-accent-600 mb-2">{listing.location}</p>
                  <p className="text-accent-600 mb-4">{listing.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingCareerListing(listing)
                      setIsCareerListingDialogOpen(true)
                    }}
                    className="hover:scale-105 transition-all duration-300 bg-transparent"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:scale-105 transition-all duration-300 bg-transparent"
                    onClick={() => deleteCareerListing(listing.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              {listing.requirements && listing.requirements.length > 0 && (
                <div>
                  <h4 className="font-medium text-accent-900 mb-3">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {listing.requirements.map((req, index) => (
                      <Badge key={index} variant="secondary" className="bg-secondary-100 text-secondary-800">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* NEW: Applications list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-accent-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-600" />
            Applications ({applications.length})
          </h3>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="glass-card border-0 shadow-xl hover-lift">
              <CardContent className="p-6">
<div className="flex justify-between items-start mb-2">
  <div className="flex-1">
    <h4 className="text-lg font-semibold text-accent-900">{app.name}</h4>
    <p className="text-sm text-accent-600">{app.email}{app.phone ? ` • ${app.phone}` : ""}</p>
    <p className="text-xs text-accent-500 mt-1">Submitted: {formatDate(app.created_at)}</p>
  </div>

  {/* NEW: delete application */}
  <Button
    size="sm"
    variant="outline"
    className="text-red-600 hover:text-red-700 hover:bg-red-50"
    onClick={() => deleteApplication(app)}
  >
    <Trash2 className="w-4 h-4 mr-1" />
    Delete
  </Button>
</div>


                {app.message && (
                  <div className="mt-3">
                    <h5 className="font-medium text-accent-900 mb-2">Message</h5>
                    <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-orange-500">
                      <p className="text-accent-700">{app.message}</p>
                    </div>
                  </div>
                )}

{app.files && app.files.length > 0 && (
  <div className="mt-4">
    <h5 className="font-medium text-accent-900 mb-2">Files ({app.files.length})</h5>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {app.files.map((f: any, idx: number) => {
        console.log("File object:", f); // Add this to debug
        const filePath: string | undefined = (f?.path ?? f?.key ?? f?.objectKey)?.replace?.(/^\/+/, "");
        return (
          <div
            key={idx}
            className="flex items-center space-x-3 bg-white p-3 rounded-lg border hover:shadow-md transition-all duration-300"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-accent-900 truncate">{f.name}</p>
              <p className="text-sm text-accent-500">{formatFileSize(f.size)}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-primary-50"
              onClick={() => downloadApplicationFile(f)}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        );
      })}
    </div>
  </div>
)}


              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 shadow-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl opacity-20"></div>
                <div className="relative bg-white p-2 rounded-2xl shadow-lg">
                  <Image
                    src="/images/castpro-logo.png"
                    alt="Castpro Engineering"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Castpro Engineering
                </h1>
                <p className="text-sm text-accent-600 font-medium">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-accent-600 hover:text-accent-900 transition-colors duration-300 font-medium">
                View Website
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover:scale-105 transition-all duration-300 bg-transparent border-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-72 bg-white border-r border-gray-200 min-h-screen shadow-xl">
          <nav className="p-6">
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 font-medium ${
                    activeTab === "dashboard"
                      ? "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 shadow-lg scale-105"
                      : "text-accent-600 hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  <LayoutDashboard className="w-6 h-6" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 font-medium ${
                    activeTab === "projects"
                      ? "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 shadow-lg scale-105"
                      : "text-accent-600 hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  <FileText className="w-6 h-6" />
                  <span>Projects</span>
                  {projects.filter((p) => p.status === "new").length > 0 && (
                    <Badge className="bg-red-500 text-white ml-auto">
                      {projects.filter((p) => p.status === "new").length}
                    </Badge>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("contacts")}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 font-medium ${
                    activeTab === "contacts"
                      ? "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 shadow-lg scale-105"
                      : "text-accent-600 hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  <Users className="w-6 h-6" />
                  <span>Contacts</span>
                  {contacts.filter((c) => c.status === "new").length > 0 && (
                    <Badge className="bg-blue-500 text-white ml-auto">
                      {contacts.filter((c) => c.status === "new").length}
                    </Badge>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 font-medium ${
                    activeTab === "services"
                      ? "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 shadow-lg scale-105"
                      : "text-accent-600 hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  <Settings className="w-6 h-6" />
                  <span>Services</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("careers")}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 font-medium ${
                    activeTab === "careers"
                      ? "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 shadow-lg scale-105"
                      : "text-accent-600 hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  <Briefcase className="w-6 h-6" />
                  <span>Careers</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "projects" && renderProjects()}
          {activeTab === "contacts" && renderContacts()}
          {activeTab === "services" && renderServices()}
          {activeTab === "careers" && renderCareers()}
        </main>
      </div>

      {/* Project dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <FileText className="w-6 h-6 mr-2 text-primary-600" />
              Project Details
            </DialogTitle>
            <DialogDescription>Complete information about the submitted project</DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-accent-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <p><strong>Name:</strong> {selectedProject.name}</p>
                    <p><strong>Email:</strong> {selectedProject.email}</p>
                    {selectedProject.phone && (<p><strong>Phone/WhatsApp:</strong> {selectedProject.phone}</p>)}
                    {selectedProject.company && (<p><strong>Company:</strong> {selectedProject.company}</p>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-accent-900 mb-2">Project Status</h4>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(selectedProject.status)} border`}>
                        {getStatusIcon(selectedProject.status)}
                        <span className="ml-1 capitalize">{selectedProject.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-accent-600"><strong>Submitted:</strong> {formatDate(selectedProject.created_at)}</p>
                    <p className="text-sm text-accent-600"><strong>Last Updated:</strong> {formatDate(selectedProject.updated_at)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-accent-900 mb-2">Project Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">
                  <p className="text-accent-600 leading-relaxed">{selectedProject.project_description}</p>
                </div>
              </div>

              {selectedProject.files && selectedProject.files.length > 0 && (
                <div>
                  <h4 className="font-semibold text-accent-900 mb-3">Attached Files ({selectedProject.files.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProject.files.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 bg-white p-4 rounded-lg border hover:shadow-md transition-all duration-300"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-accent-900">{file.name}</p>
                          <p className="text-sm text-accent-500">{formatFileSize(file.size)}</p>
                        </div>
                        <a href={file.url} download={file.name}>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
              Close
            </Button>
            <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
              <Send className="w-4 h-4 mr-2" />
              Send Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <Mail className="w-6 h-6 mr-2 text-green-600" />
              Contact Message
            </DialogTitle>
            <DialogDescription>Message details and response options</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-accent-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <p><strong>Name:</strong> {selectedContact.name}</p>
                    <p><strong>Email:</strong> {selectedContact.email}</p>
                    <p><strong>Received:</strong> {formatDate(selectedContact.created_at)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-accent-900 mb-2">Status</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Badge className={selectedContact.status === "new" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                      {selectedContact.status === "new" ? <AlertCircle className="w-4 h-4 mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                      {selectedContact.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-accent-900 mb-2">Message</h4>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="text-accent-600 leading-relaxed">{selectedContact.message}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-accent-900 mb-2">Quick Reply</h4>
                <Textarea placeholder="Type your response here..." className="min-h-[100px]" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => selectedContact && updateContactStatus(selectedContact.id, "responded")}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Responded
            </Button>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <Settings className="w-6 h-6 mr-2 text-purple-600" />
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService ? "Update service information" : "Create a new service offering"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleServiceSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-accent-700 mb-2">Service Title</label>
                <Input id="title" name="title" placeholder="e.g., CNC Machining" defaultValue={editingService?.title || ""} required />
              </div>
              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-accent-700 mb-2">Subtitle</label>
                <Input id="subtitle" name="subtitle" placeholder="e.g., Precision Milling & Turning" defaultValue={editingService?.subtitle || ""} />
              </div>
            </div>

            <div>
                            <label htmlFor="description" className="block text-sm font-medium text-accent-700 mb-2">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detailed description of the service..."
                className="min-h-[100px]"
                defaultValue={editingService?.description || ""}
                required
              />
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-medium text-accent-700 mb-2">
                Features (one per line)
              </label>
              <Textarea
                id="features"
                name="features"
                placeholder={`3, 4, and 5-axis milling capabilities
Multi-axis turning with live tooling
Tolerances as tight as ±0.0001"`}
                className="min-h-[100px]"
                defaultValue={editingService?.features?.join("\n") || ""}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                name="active"
                className="rounded"
                defaultChecked={editingService?.is_active ?? true}
              />
              <label htmlFor="active" className="text-sm font-medium text-accent-700">
                Active Service
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {editingService ? "Update Service" : "Create Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Career listing dialog */}
      <Dialog open={isCareerListingDialogOpen} onOpenChange={setIsCareerListingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <Briefcase className="w-6 h-6 mr-2 text-orange-600" />
              {editingCareerListing ? "Edit Career Listing" : "Add New Career Listing"}
            </DialogTitle>
            <DialogDescription>
              {editingCareerListing ? "Update career listing information" : "Create a new job or internship listing"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCareerListingSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-accent-700 mb-2">
                  Listing Title
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Senior CNC Machinist"
                  defaultValue={editingCareerListing?.title || ""}
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-accent-700 mb-2">
                  Type
                </label>
                <Select name="type" defaultValue={editingCareerListing?.type || "job"} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job">Job</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-accent-700 mb-2">
                Location
              </label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Rawalpindi, Pakistan"
                defaultValue={editingCareerListing?.location || ""}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-accent-700 mb-2">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detailed description of the role..."
                className="min-h-[100px]"
                defaultValue={editingCareerListing?.description || ""}
                required
              />
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-accent-700 mb-2">
                Requirements (one per line)
              </label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder={`5+ years experience
Proficiency in 5-axis machining
Strong blueprint reading`}
                className="min-h-[100px]"
                defaultValue={editingCareerListing?.requirements?.join("\n") || ""}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                name="active"
                className="rounded"
                defaultChecked={editingCareerListing?.is_active ?? true}
              />
              <label htmlFor="active" className="text-sm font-medium text-accent-700">
                Active Listing
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCareerListingDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {editingCareerListing ? "Update Listing" : "Create Listing"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
