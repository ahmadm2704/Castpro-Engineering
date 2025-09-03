

import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, projectDescription, files } = body

    // Insert project into Supabase
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          name,
          email,
          company,
          project_description: projectDescription,
          files: files || [],
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: "Failed to submit project" }, { status: 500 })
    }

    console.log("Project submission received:", {
      name,
      email,
      company,
      projectDescription,
      filesCount: files?.length || 0,
    })

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Project submitted successfully",
      data: data[0],
    })
  } catch (error) {
    console.error("Error submitting project:", error)
    return NextResponse.json({ success: false, message: "Failed to submit project" }, { status: 500 })
  }
}
