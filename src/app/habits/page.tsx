"use client";

import { useState } from "react";

interface Habit {
  id: string;
  label: string;
  group: "Sleep" | "Work" | "Mind" | "Body" | "Money" | "Systems";
}

const HABITS: Habit[] = [
  { id: "reveil", label: "Réveil 05:50", group: "Sleep" },
  { id: "dormir", label: "Dormir 20:45", group: "Sleep" },
  { id: "sleep-hours", label: "Track hours of sleep", group: "Sleep" },

  { id: "deep-work", label: "Deep work 3h", group: "Work" },
  { id: "goal-hours", label: "Hours worked on \"Goal\"", group: "Work" },

  { id: "read-3min", label: "3min read", group: "Mind" },
  { id: "meditation", label: "10min meditation", group: "Mind" },
  { id: "journal", label: "Journal", group: "Mind" },

  { id: "gym", label: "🏋️ gym / recovery", group: "Body" },
  { id: "food-tracking", label: "Food tracking", group: "Body" },
  { id: "protein", label: "Protein tracked", group: "Body" },
  { id: "carbs", label: "Carbs tracked", group: "Body" },
  { id: "fat", label: "Fat tracked", group: "Body" },
  { id: "calories", label: "Calories tracked", group: "Body" },
  { id: "deficit", label: "Calorie deficit / surplus logged", group: "Body" },
  { id: "weight", label: "Weight (kg) logged", group: "Body" },

  { id: "income", label: "Income logged", group: "Money" },
  { id: "money-tracking", label: "Money tracking", group: "Money" },

  { id: "blocage", label: "Blocage effectif", group: "Systems" },
  { id: "timeboxed", label: "Time boxed", group: "Systems" },
  { id: "tracking", label: "Tracking done", group: "Systems" },
];

const GROUPS: { id: Habit["group"]; label: string }[] = [
  { id: "Sleep", label: "Sleep" },
  { id: "Work", label: "Work" },
  { id: "Mind", label: "Mind" },
  { id: "Body", label: "Body" },
  { id: "Money", label: "Money" },
  { id: "Systems", label: "Systems" },
];

export default function HabitsPage() {
  const [todayState, setTodayState] = useState<Record<string, boolean>>({});

  const totalHabits = HABITS.length;
  const completedHabits = HABITS.filter((h) => todayState[h.id]).length;
  const completion = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  const toggleHabit = (id: string) => {
    setTodayState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 shadow-xl shadow-emerald-500/10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Daily Habit Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
              Core habits for hardgainer mode
            </h1>
            <p className="mt-2 text-sm text-zinc-400 md:max-w-2xl">
              This is a v1 mirror of your Notion habit system. Well hook it to Supabase
              + training logic next; for now its a clean UI to track today.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-zinc-400">Today completion</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-purple-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-zinc-50">{completion}%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
        {/* Today habits */}
        <div className="space-y-3 rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-50 md:text-base">Today</h2>
            <span className="text-xs text-zinc-500">
              {completedHabits}/{totalHabits} habits checked
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {GROUPS.map((group) => (
              <div key={group.id} className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {group.label}
                </h3>
                <div className="space-y-1.5">
                  {HABITS.filter((h) => h.group === group.id).map((habit) => (
                    <label
                      key={habit.id}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/5 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-200 transition hover:border-emerald-400/60 hover:bg-zinc-900"
                    >
                      <input
                        type="checkbox"
                        checked={!!todayState[habit.id]}
                        onChange={() => toggleHabit(habit.id)}
                        className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-900 text-emerald-400 focus:ring-emerald-500"
                      />
                      <span>{habit.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly / metrics placeholder */}
        <div className="space-y-3 rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
          <h2 className="text-sm font-semibold text-zinc-50 md:text-base">
            This week & metrics (v1)
          </h2>
          <p className="text-xs text-zinc-400">
            For now this is a simple today tracker. Next iterations:
          </p>
          <ul className="list-disc space-y-1 pl-4 text-xs text-zinc-300">
            <li>Store daily rows in Supabase (like your Notion table).</li>
            <li>Plot weight, sleep, calories, and income over time.</li>
            <li>Connect training split + progression for hardgainer plan.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
