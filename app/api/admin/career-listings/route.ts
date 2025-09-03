import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.from("career_listings").select("*").order("created_at", { ascending: false })
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: "Failed to fetch career listings" }, { status: 500 })
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching career listings:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch career listings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, type, location, description, requirements, is_active } = body

    const { data, error } = await supabase
      .from("career_listings")
      .insert([{ title, type, location, description, requirements, is_active }])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: "Failed to create career listing" }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: data[0] })
  } catch (error) {
    console.error("Error creating career listing:", error)
    return NextResponse.json({ success: false, message: "Failed to create career listing" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, type, location, description, requirements, is_active } = body

    const { data, error } = await supabase
      .from("career_listings")
      .update({ title, type, location, description, requirements, is_active, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: "Failed to update career listing" }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: data[0] })
  } catch (error) {
    console.error("Error updating career listing:", error)
    return NextResponse.json({ success: false, message: "Failed to update career listing" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("career_listings").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: "Failed to delete career listing" }, { status: 500 })
    }
    return NextResponse.json({ success: true, message: "Career listing deleted successfully" })
  } catch (error) {
    console.error("Error deleting career listing:", error)
    return NextResponse.json({ success: false, message: "Failed to delete career listing" }, { status: 500 })
  }
}
