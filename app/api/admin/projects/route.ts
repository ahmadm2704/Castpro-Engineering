// app/api/admin/projects/route.ts
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ success: false, message: "Error fetching projects" }, { status: 500 })
  }

  return NextResponse.json({ success: true, projects: data })
}
