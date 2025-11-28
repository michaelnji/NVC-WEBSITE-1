import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from("services").select("*").order("order_index")

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    // Normalize title to lowercase
    const normalizedTitle = body.title?.toLowerCase() || "";

    // Check for duplicate title
    const { data: existingService } = await supabase
      .from("services")
      .select("id")
      .eq("title", normalizedTitle)
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
      .insert([normalizedBody])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
