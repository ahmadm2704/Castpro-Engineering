import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      )
    }

    // ✅ Fetch user by username or email — and get password_hash
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("id, username, email, password_hash") 
      .or(`username.eq.${username},email.eq.${username}`)
      .maybeSingle()

    console.log("🧪 Supabase returned:", user)

    if (error || !user || !user.password_hash) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // ✅ Compare password with hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true, message: "Login successful" })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Login failed" }, { status: 500 })
  }
}
