import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabase = createAdminClient();

    // Normalize title to lowercase
    const normalizedTitle = body.title?.toLowerCase() || "";

    // Check for duplicate title (excluding current service)
    const { data: existingService } = await supabase
      .from("services")
      .select("id")
      .eq("title", normalizedTitle)
      .neq("id", id)
      .single();

    if (existingService) {
      return NextResponse.json(
        { error: "A service with this name already exists" },
        { status: 409 }
      );
    }

    const normalizedBody = {
      ...body,
      title: normalizedTitle,
    };

    const { data, error } = await supabase
      .from("services")
      .update(normalizedBody)
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
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
      .from("services")
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
        console.error("Failed to delete service file from storage", e)
      }
    }

    const { error } = await supabase.from("services").delete().eq("id", id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
