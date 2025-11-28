import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .substring(0, 50); // Limit length
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const customName = formData.get("customName") as string | null;
    const index = formData.get("index") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const supabase = createAdminClient();
    const bucket = "images NVC";

    const ext = file.name.includes(".")
      ? file.name.split(".").pop() || "bin"
      : "bin";

    // Build filename based on custom name or original
    let filename: string;
    if (customName) {
      const slug = slugify(customName);
      const indexSuffix = index ? `-${index}` : "";
      filename = `${slug}${indexSuffix}.${ext}`;
    } else {
      const safeName = file.name.replace(/[^a-zA-Z0-9\.\-_]/g, "_");
      filename = safeName;
    }

    const path = `uploads/${Date.now()}-${filename}`;

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
      filename: filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("[upload] Supabase Storage error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}
