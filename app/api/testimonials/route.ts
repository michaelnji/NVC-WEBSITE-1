import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("testimonials").select("*").order("order_index")

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase.from("testimonials").insert([body]).select()

    if (error) throw error
    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
