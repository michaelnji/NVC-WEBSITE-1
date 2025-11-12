import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from("hero_images").select("*").order("order_index")

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createAdminClient()

    const { data, error } = await supabase.from("hero_images").insert([body]).select()

    if (error) throw error
    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
