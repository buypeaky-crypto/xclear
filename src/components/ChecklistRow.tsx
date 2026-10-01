"use client";

import { useState, type ReactNode } from "react";

export type ChecklistState = "pass" | "risk" | "fail" | "neutral";

const stateStyles: Record<ChecklistState, { icon: string; iconClass: string }> = {
  pass: { icon: "✅", iconClass: "bg-emerald-100 text-emerald-700" },
  risk: { icon: "⚠️", iconClass: "bg-amber-100 text-amber-800" },
  fail: { icon: "🚫", iconClass: "bg-red-100 text-red-700" },
  neutral: { icon: "·", iconClass: "bg-stone-100 text-stone-600" },
};

export default function ChecklistRow({
  id,
  state,
  label,
  explanation,
  children,
}: {
  id: string;
  state: ChecklistState;
  label: string;
  explanation: string;
  children?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const style = stateStyles[state];

  return (
    <li className="border-b border-stone-200 last:border-0">
      <div className="flex items-center gap-3 py-4">
        <span aria-hidden="true" className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-base font-bold ${style.iconClass}`}>
          {style.icon}
        </span>
        <span className="min-w-0 flex-1 text-sm font-semibold leading-6 text-stone-800">{label}</span>
        <button
          type="button"
          aria-label={`${expanded ? "Hide" : "Show"} details: ${label}`}
          aria-expanded={expanded}
          aria-controls={`${id}-details`}
          onClick={() => setExpanded(!expanded)}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-stone-400 text-xs font-bold text-stone-600 transition-colors hover:border-violet-600 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
        >
          i
        </button>
      </div>
      {expanded && (
        <div id={`${id}-details`} className="mb-4 ml-10 rounded-md bg-[#fdf6e3] px-4 py-3 text-sm leading-6 text-stone-700">
          <p>{explanation}</p>
          {children}
        </div>
      )}
    </li>
  );
}