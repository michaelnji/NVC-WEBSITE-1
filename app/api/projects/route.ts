import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const serviceId = request.nextUrl.searchParams.get("service_id")
    const supabase = await createClient()

    let query = supabase.from("projects").select("*")

    if (serviceId) {
      query = query.eq("service_id", serviceId)
    }

    const { data, error } = await query.order("order_index")

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

    const { data, error } = await supabase.from("projects").insert([body]).select()

    if (error) throw error
    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
