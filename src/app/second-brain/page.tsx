"use client";

import { useEffect, useMemo, useState } from "react";

// Types
interface Memory {
  id: string;
  title: string;
  category:
    | "YouTube"
    | "Shadow Operator"
    | "Body"
    | "Move"
    | "Books"
    | "AI"
    | "Other";
  tags: string[];
  content: string;
  createdAt: string; // ISO string
}

const CATEGORIES: Memory["category"][] = [
  "YouTube",
  "Shadow Operator",
  "Body",
  "Move",
  "Books",
  "AI",
  "Other",
];

export default function SecondBrainPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Memory["category"]>("YouTube");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<Memory["category"] | "All">(
    "All",
  );

  // Load from API on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/memories");
        if (!res.ok) throw new Error("Failed to fetch memories");
        const json = (await res.json()) as { memories: any[] };
        const mapped: Memory[] = (json.memories || []).map((m) => ({
          id: m.id,
          title: m.title,
          category: (m.category || "Other") as Memory["category"],
          tags: Array.isArray(m.tags) ? m.tags : [],
          content: m.content || "",
          createdAt: m.created_at || new Date().toISOString(),
        }));
        setMemories(mapped);
      } catch (err) {
        console.error("Failed to load memories", err);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const filteredMemories = useMemo(() => {
    return memories
      .filter((m) => {
        if (filterCategory !== "All" && m.category !== filterCategory) return false;
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.content.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [memories, search, filterCategory]);

  const handleAddMemory = async () => {
    if (!title.trim() && !content.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setIsSaving(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Untitled",
          category,
          tags,
          content: content.trim(),
          source: "dashboard",
        }),
      });

      if (!res.ok) {
        console.error("Failed to save memory", await res.text());
        return;
      }

      const json = (await res.json()) as { memory: any };
      const m = json.memory;
      const newMemory: Memory = {
        id: m.id,
        title: m.title,
        category: (m.category || "Other") as Memory["category"],
        tags: Array.isArray(m.tags) ? m.tags : [],
        content: m.content || "",
        createdAt: m.created_at || new Date().toISOString(),
      };

      setMemories((prev) => [newMemory, ...prev]);

      // Reset form
      setTitle("");
      setContent("");
      setTagsInput("");
    } catch (err) {
      console.error("Failed to save memory", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearAll = () => {
    if (!window.confirm("Clear ALL memories loaded from Supabase?")) return;
    setMemories([]);
    // Note: we don't delete from DB yet in v1
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-zinc-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 md:pt-10 lg:flex-row">
        {/* Left: Capture panel */}
        <div className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 p-5 shadow-2xl shadow-purple-500/10 backdrop-blur md:w-[40%]">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-50 md:text-xl">
                Second Brain
              </h1>
              <p className="text-xs text-zinc-400 md:text-sm">
                Capture ideas, notes, and tasks directly from Vox.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-500/30">
              Live · Local
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-300">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hook idea for hardgainer short"
                className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-50 outline-none ring-offset-0 transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Memory["category"])}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-50 outline-none ring-offset-0 transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/40"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-300">
                  Tags
                </label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="comma separated, e.g. hook, script, offer"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-50 outline-none ring-offset-0 transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-300">
                Note
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Dump the idea. Vox will help you connect it to your goals later."
                className="w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-50 outline-none ring-offset-0 transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddMemory}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-purple-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={(!title.trim() && !content.trim()) || isSaving}
              >
                Save memory
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-xl border border-red-500/40 bg-red-500/5 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/10"
              >
                Clear all
              </button>
            </div>

            <p className="text-[10px] leading-relaxed text-zinc-500">
              v1 is stored locally in this browser only. Next step: wire this into Vox's
              long-term memory so I can search and use these notes across devices.
            </p>
          </div>
        </div>

        {/* Right: Search & results */}
        <div className="w-full space-y-4 md:w-[60%]">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900/70 p-4 shadow-2xl shadow-emerald-500/10 backdrop-blur">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <h2 className="text-sm font-semibold text-zinc-50 md:text-base">
                  Search your second brain
                </h2>
                <p className="text-xs text-zinc-400">
                  Filter by project, then search by title, tags, or content.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-400">
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800/70 px-2 py-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${isLoading ? "bg-zinc-500" : "bg-emerald-400"}`} />
                  {isLoading ? "Loading..." : `${memories.length} memories`}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex-1">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search anything: "hardgainer hooks", "Senegal gyms", "offer ideas"...'
                  className="h-10 w-full rounded-xl border border-white/10 bg-zinc-950/70 px-3 text-xs text-zinc-50 outline-none ring-offset-0 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="flex flex-wrap gap-1 text-[10px] md:w-56">
                <button
                  type="button"
                  onClick={() => setFilterCategory("All")}
                  className={`rounded-full px-3 py-1 transition ${
                    filterCategory === "All"
                      ? "bg-zinc-100 text-zinc-900"
                      : "bg-zinc-800/70 text-zinc-300 hover:bg-zinc-700/80"
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory(cat)}
                    className={`rounded-full px-3 py-1 transition ${
                      filterCategory === cat
                        ? "bg-emerald-400 text-zinc-950"
                        : "bg-zinc-800/70 text-zinc-300 hover:bg-zinc-700/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredMemories.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-zinc-900/40 text-center text-xs text-zinc-500">
                <p>No memories match this view yet.</p>
                <p className="max-w-xs text-[11px] text-zinc-500">
                  Start by capturing a few ideas on the left — this page will become
                  the place where we connect dots between your goals.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {filteredMemories.map((m) => {
                  const date = new Date(m.createdAt);
                  const formatted = date.toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <article
                      key={m.id}
                      className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-zinc-900/70 to-zinc-950/90 p-4 shadow-lg shadow-black/40 transition hover:border-emerald-400/60 hover:shadow-emerald-500/20"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-50">
                            {m.title}
                          </h3>
                          <span className="shrink-0 rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                            {m.category}
                          </span>
                        </div>
                        <p className="line-clamp-4 text-[11px] leading-relaxed text-zinc-400">
                          {m.content || "No additional note."}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          {m.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-300"
                            >
                              #{tag}
                            </span>
                          ))}
                          {m.tags.length > 3 && (
                            <span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-400">
                              +{m.tags.length - 3} more
                            </span>
                          )}
                        </div>
                        <time className="text-[10px] text-zinc-500">
                          {formatted}
                        </time>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
