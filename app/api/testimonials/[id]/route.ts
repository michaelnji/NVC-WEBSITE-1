import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const supabase = createAdminClient()

    const { data, error } = await supabase.from("testimonials").update(body).eq("id", id).select()

    if (error) throw error
    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = createAdminClient()
    const { data: toDelete, error: fetchError } = await supabase
      .from("testimonials")
      .select("photo_url")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    const imageUrl = toDelete?.photo_url as string | undefined
    if (imageUrl && imageUrl.includes("/storage/v1/object/public/")) {
      try {
        const url = new URL(imageUrl)
        const parts = url.pathname.split("/storage/v1/object/public/")[1]?.split("/") || []
        const bucket = parts.shift()
        const path = parts.join("/")
        if (bucket && path) {
          await supabase.storage.from(bucket).remove([path])
        }
      } catch (e) {
        console.error("Failed to delete testimonial file from storage", e)
      }
    }

    const { error } = await supabase.from("testimonials").delete().eq("id", id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
