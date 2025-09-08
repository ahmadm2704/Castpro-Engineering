"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, Sparkles, Shield } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [particlePositions, setParticlePositions] = useState<number[]>([])

  useEffect(() => {
    const positions = Array.from({ length: 12 }, () => Math.random() * 100)
    setParticlePositions(positions)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        // Set cookie to mark login session
        document.cookie = "admin-auth=true; path=/; max-age=3600"

        // Redirect to dashboard
        window.location.href = "/admin/dashboard"
      } else {
        const result = await response.json()
        setError(result.message || "Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-accent-900 to-primary-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Hydration-safe Particles */}
      <div className="particles">
        {particlePositions.map((top, i) => (
          <div key={i} className="particle" style={{ top: `${top}%` }}></div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="border-0 shadow-2xl glass-card scale-in">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Image
                  src="/images/castpro-logo.png"
                  alt="Castpro Engineering"
                  width={60}
                  height={60}
                  className="w-15 h-15 object-contain floating"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full opacity-20 pulse-glow"></div>
              </div>
            </div>
            <CardTitle className="text-2xl font-display font-bold text-gradient mb-2">Admin Portal</CardTitle>
            <p className="text-accent-600 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Sign in to access the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg slide-up">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-accent-700">
                  Username or Email
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleInputChange}
                  className="w-full border-gradient focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                  placeholder="Enter your username or email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-accent-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="w-full pr-10 border-gradient focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary-600 transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 hover-lift pulse-glow"
              >
                {isLoading ? (
                  <>
                    <div className="loading-dots mr-2">
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                    </div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Sign In
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-accent-600 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Secure admin access for Castpro Engineering
              </p>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
