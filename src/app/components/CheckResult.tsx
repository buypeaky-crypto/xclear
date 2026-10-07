type Signal = {
  id: 'search_suggestion' | 'search_ban' | 'ghost' | 'reply';
  hasSignal: boolean; // true = ban detected, false = ok (your current "No signal")
}

const SIGNAL_COPY = {
  search_suggestion: {
    title: "Search Suggestion",
    ok: "Your profile appears when people type your @",
    bad: "Your profile doesn't appear in search suggestions",
    detailOk: "We searched logged-out and found your profile in typeahead.",
    detailBad: "Logged-out check could not find you in suggestions — possible deboost.",
  },
  search_ban: {
    title: "Search Visibility",
    ok: "Your posts appear in search",
    bad: "Your posts are hidden from search",
    detailOk: "Public signal returned as visible in logged-out search check.",
    detailBad: "Your posts did not appear in logged-out search — search ban signal.",
  },
  ghost: {
    title: "Profile Visibility",
    ok: "Your profile is public",
    bad: "Your profile is hidden logged-out",
    detailOk: "Your profile page is visible when logged out — not ghost banned.",
    detailBad: "Your profile was not visible logged-out — ghost ban signal.",
  },
  reply: {
    title: "Reply Visibility",
    ok: "Your replies are visible",
    bad: "Your replies are hidden",
    detailOk: "Your replies were visible in logged-out check — no deboost.",
    detailBad: "Your replies were hidden under 'Show more' — reply deboost signal.",
  }
};

export function CheckResult({ username, signals }: { username: string, signals: Signal[] }) {
  const allClear = signals.every(s => !s.hasSignal);
  const passed = signals.filter(s => !s.hasSignal).length;

  return (
    <div className="space-y-4">
      {/* Top banner — this is what he asked for: green check box */}
      <div className={`rounded-xl border p-4 ${allClear ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <h2 className={`font-bold flex items-center gap-2 ${allClear ? 'text-green-800' : 'text-red-800'}`}>
          {allClear ? '✅ All clear — no shadowban detected' : '⚠️ Visibility issues detected'}
        </h2>
        <p className={`text-sm mt-1 ${allClear ? 'text-green-700' : 'text-red-700'}`}>
          @{username} — {passed}/{signals.length} checks passed. {allClear ? 'You are visible in logged-out checks.' : 'Some checks failed, see below.'}
        </p>
      </div>

      {/* 4 signals */}
      <div className="grid gap-3">
        {signals.map(s => {
          const copy = SIGNAL_COPY[s.id];
          const ok = !s.hasSignal;
          return (
            <div key={s.id} className={`rounded-lg border p-4 flex gap-3 ${ok ? 'bg-white border-green-200' : 'bg-white border-red-200'}`}>
              <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-sm ${ok ? 'bg-green-100' : 'bg-red-100'}`}>
                {ok ? '✅' : '❌'}
              </div>
              <div>
                <div className="font-semibold flex gap-2">
                  {copy.title} <span className={ok ? 'text-green-600' : 'text-red-600'}>{ok ? '— OK' : '— Issue'}</span>
                </div>
                <div className="text-sm mt-1">{ok ? copy.ok : copy.bad}</div>
                <div className="text-xs text-gray-500 mt-1">{ok ? copy.detailOk : copy.detailBad}</div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-2">Four visibility signals, with clear limits. These are logged-out checks, not a platform verdict.</p>
    </div>
  );
}
