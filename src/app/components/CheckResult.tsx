"use client";
const COPY = {
  search_suggestion: { title:"Search Suggestion", ok:"OK", detailOk:"Your profile appears when people type your @ - visible in logged-out check.", detailBad:"Did not appear in suggestion." },
  search_ban: { title:"Search Ban", ok:"OK", detailOk:"Your posts appear in logged-out search - no search ban.", detailBad:"Not in search." },
  ghost: { title:"Profile Visibility", ok:"OK", detailOk:"Your profile is visible logged-out - not ghost banned.", detailBad:"Not visible logged-out." },
  reply: { title:"Reply Visibility", ok:"OK", detailOk:"Your replies were visible in logged-out check - no deboost.", detailBad:"Hidden under Show more." },
} as const;

type S = { id: keyof typeof COPY; hasSignal: boolean };

export function CheckResult({ username, signals }: { username: string; signals: S[] }) {
  const passed = signals.filter(s=>!s.hasSignal).length;
  return (
    <div>
      <div className="bg-green-500 text-white rounded-2xl p-4 mb-4 font-bold">
        ✅ All clear — @{username} — {passed}/{signals.length} passed.
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {signals.map(s=>{
          const c=COPY[s.id]; const ok=!s.hasSignal;
          return <div key={s.id} className={`p-4 rounded-xl border-2 ${ok?"bg-green-50 border-green-500":"bg-amber-50 border-amber-500"}`}>
            <div className="font-bold">{ok?"✅":"⚠️"} {ok?c.ok:"Flagged"}</div>
            <div className="font-bold mt-1">{c.title}</div>
            <div className="text-sm mt-1">{ok?c.detailOk:c.detailBad}</div>
          </div>
        })}
      </div>
    </div>
  );
}
