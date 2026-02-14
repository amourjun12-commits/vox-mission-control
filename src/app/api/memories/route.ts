import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// Basic schema in Supabase:
// create table memories (
//   id uuid primary key default gen_random_uuid(),
//   title text not null,
//   category text not null,
//   tags text[],
//   content text,
//   created_at timestamptz default now(),
//   source text default 'dashboard'
// );

export async function GET() {
  const { data, error } = await supabaseServer
    .from("memories")
    .select("id, title, category, tags, content, created_at, source")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("GET /api/memories error", error);
    return NextResponse.json({ error: "Failed to load memories" }, { status: 500 });
  }

  return NextResponse.json({ memories: data ?? [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, tags, content, source } = body ?? {};

    if (!title && !content) {
      return NextResponse.json(
        { error: "Title or content is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseServer
      .from("memories")
      .insert({
        title: title || "Untitled",
        category: category || "Other",
        tags: Array.isArray(tags) ? tags : [],
        content: content || "",
        source: source || "dashboard",
      })
      .select("id, title, category, tags, content, created_at, source")
      .single();

    if (error) {
      console.error("POST /api/memories error", error);
      return NextResponse.json(
        { error: "Failed to save memory" },
        { status: 500 },
      );
    }

    return NextResponse.json({ memory: data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/memories exception", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
