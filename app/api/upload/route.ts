import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const supabase = createAdminClient()
    const bucket = "images NVC"

    const ext = file.name.includes(".") ? file.name.split(".").pop() || "bin" : "bin"
    const safeName = file.name.replace(/[^a-zA-Z0-9\.\-_]/g, "_")
    const path = `uploads/${Date.now()}-${safeName}`

    const { data, error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    })

    if (error || !data) {
      throw error || new Error("Upload to Supabase Storage failed")
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return NextResponse.json({
      url: publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[upload] Supabase Storage error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}
