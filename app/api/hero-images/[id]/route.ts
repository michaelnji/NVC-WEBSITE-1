import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const body = await request.json()
    const supabase = createAdminClient()

    const updateData: Record<string, any> = {}
    if (typeof body.image_url === "string") updateData.image_url = body.image_url
    if (typeof body.title === "string") updateData.title = body.title
    if (typeof body.description === "string") updateData.description = body.description
    if (typeof body.order_index === "number") updateData.order_index = body.order_index

    const { data, error } = await supabase
      .from("hero_images")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const supabase = createAdminClient()
    const { data: toDelete, error: fetchError } = await supabase
      .from("hero_images")
      .select("image_url")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    const imageUrl = toDelete?.image_url as string | undefined
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
        console.error("Failed to delete hero_image file from storage", e)
      }
    }

    const { error } = await supabase.from("hero_images").delete().eq("id", id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
