"use client"
import { useState } from "react"

export default function Home() {
  const [username, setUsername] = useState("GutNews247")
  const [inputVal, setInputVal] = useState("GutNews247")
  const [result, setResult] = useState<any>({
    username: "GutNews247",
    exists: true,
    searchSuggestionBan: false,
    searchBan: false,
    ghostBan: false,
    replyDeboosting: false,
  })
  const [loading, setLoading] = useState(false)
  const [showCrypto, setShowCrypto] = useState(false)
  const [openInfo, setOpenInfo] = useState<string | null>(null)

  const handleCheck = async () => {
    const clean = inputVal.replace(/^@/, "").trim()
    if (!clean) return
    setUsername(clean)
    setLoading(true)
    try {
      const res = await fetch(`/api/check?username=${encodeURIComponent(clean)}`)
      const data = await res.json()
      setResult({
        username: data.username || clean,
        exists: true,
        searchSuggestionBan: data.searchSuggestionBan || false,
        searchBan: data.searchBan || false,
        ghostBan: data.ghostBan || false,
        replyDeboosting: data.replyDeboosting || false,
      })
    } catch {
      setResult({ username: clean, exists: true, searchSuggestionBan: false, searchBan: false, ghostBan: false, replyDeboosting: false })
    }
    setLoading(false)
  }

  const InfoRow = ({ id, label, desc, isBan }: { id: string; label: string; desc: string; isBan: boolean }) => (
    <div className="border-b last:border-0 border-gray-200">
      <div className="flex items-center justify-between p-4 px-6 cursor-pointer hover:bg-gray-50" onClick={() => setOpenInfo(openInfo === id ? null : id)}>
        <div className="flex items-center gap-3">
          <span className={`text-xl ${isBan ? "text-red-500" : "text-[#27ae60]"}`}>{isBan ? "✕" : "✓"}</span>
          <span className={`text-[15px] ${isBan ? "text-red-600" : "text-[#27ae60]"}`}>{label}</span>
        </div>
        <span className={`text-[11px] transition-transform ${openInfo === id ? "rotate-180" : ""}`}>ℹ️ ▾</span>
      </div>
      {openInfo === id && <div className="px-6 pb-4 text-[13px] text-gray-600 bg-[#f8fbff] leading-relaxed">{desc}</div>}
    </div>
  )

  return (
    <main className="min-h-screen bg-[#e6edf5] pb-24">
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="text-center">
          <h1 className="leading-[1.15] font-bold">
            <span className="text-[#2a7fb8] italic" style={{ fontFamily: "Georgia, serif", fontSize: "42px" }}>Is </span>
            <span className="text-[#8e44ad] italic" style={{ fontFamily: "Georgia, serif", fontSize: "42px" }}>@{username}</span>
            <br />
            <span className="text-[#2a7fb8] italic" style={{ fontFamily: "Georgia, serif", fontSize: "42px" }}>shadowbanned on Twitter?</span>
          </h1>
          <div className="flex justify-center mt-8">
            <a href="https://paypal.me/BDXII" target="_blank" rel="noopener noreferrer" className="bg-white border border-[#2a7fb8] text-[#2a7fb8] rounded-full px-8 py-2.5 text-[13px] font-semibold tracking-wide hover:bg-[#f0f8ff]">SUPPORT US</a>
          </div>
        </div>

        <div className="bg-white shadow mt-10 p-8 flex flex-col sm:flex-row items-center justify-center gap-6 rounded-[2px]">
          <div className="flex flex-col">
            <label className="text-[11px] text-[#2a7fb8] mb-1">username</label>
            <div className="flex items-end border-b border-gray-300 pb-1 w-[280px]">
              <span className="text-[#8e44ad] text-[26px] font-bold mr-2">@</span>
              <input value={inputVal} onChange={(e) => setInputVal(e.target.value.replace(/^@/, ""))} onKeyDown={(e) => e.key === "Enter" && handleCheck()} className="flex-1 outline-none text-[17px] text-[#8e44ad] bg-transparent" />
            </div>
          </div>
          <button onClick={handleCheck} disabled={loading} className="border border-[#2a7fb8] text-[#2a7fb8] rounded-full px-7 py-2 text-[13px] hover:bg-[#f0f8ff] disabled:opacity-50">{loading ? "CHECKING..." : "CHECK"}</button>
        </div>

        {result && (
          <div className="bg-white shadow mt-6 overflow-hidden rounded-[2px]">
            <div className="flex items-center gap-3 p-4 px-6 border-b border-gray-200"><span className="text-[#27ae60] text-xl">✓</span><span className="text-[15px]"><span className="text-[#2a7fb8]">@{result.username}</span> <span className="text-[#27ae60]">exists.</span></span></div>
            <InfoRow id="sugg" label={result.searchSuggestionBan ? "Search suggestion ban." : "No search suggestion ban."} isBan={result.searchSuggestionBan} desc="Typeahead test: When you type @username in Twitter search, does it auto-suggest? If not, you have a search suggestion ban. Profile hidden from typeahead." />
            <InfoRow id="search" label={result.searchBan ? "Search ban." : "No search ban."} isBan={result.searchBan} desc="Search ban: Your tweets don't appear in search results for logged-out users. Searching from:@username shows nothing." />
            <InfoRow id="ghost" label={result.ghostBan ? "Ghost ban." : "No ghost ban."} isBan={result.ghostBan} desc="Ghost ban: Your tweets are visible only to you, invisible to everyone else. The classic shadowban." />
            <InfoRow id="reply" label={result.replyDeboosting ? "Reply deboosting detected." : "No reply deboosting detected."} isBan={result.replyDeboosting} desc="Reply deboosting: Your replies are collapsed under 'Show more replies' so almost nobody sees them." />
          </div>
        )}

        <div className="bg-white shadow mt-8 divide-y divide-gray-200 rounded-[2px]">
          <div>
            <div className="p-4 px-6 flex justify-between items-center cursor-pointer" onClick={() => setOpenInfo(openInfo === "q1" ? null : "q1")}><p className="text-[#8e44ad] text-[14px]">Twitter reserves the right to limit distribution or visibility of content</p><span className={`text-xs transition-transform ${openInfo === "q1" ? "rotate-180" : ""}`}>▼</span></div>
            {openInfo === "q1" && <div className="px-6 pb-4 text-[13px] text-gray-600">X says they don't shadowban, but they do limit visibility for policy violations. This tool detects technical bans, not algorithmic downranking.</div>}
          </div>
          <div>
            <div className="p-4 px-6 flex justify-between items-center cursor-pointer" onClick={() => setOpenInfo(openInfo === "q2" ? null : "q2")}><span className="text-[14px]">Why is the QFD test gone?</span><span className={`text-xs transition-transform ${openInfo === "q2" ? "rotate-180" : ""}`}>▼</span></div>
            {openInfo === "q2" && <div className="px-6 pb-4 text-[13px] text-gray-600">QFD (Quality Filter Discrimination) was removed by X in 2023. The endpoint no longer exists, so we removed it from the checker.</div>}
          </div>
          <div>
            <div className="p-4 px-6 flex justify-between items-center cursor-pointer" onClick={() => setOpenInfo(openInfo === "q3" ? null : "q3")}><span className="text-[14px]">How does this tester work?</span><span className={`text-xs transition-transform ${openInfo === "q3" ? "rotate-180" : ""}`}>▼</span></div>
            {openInfo === "q3" && <div className="px-6 pb-4 text-[13px] text-gray-600">We use logged-out Twitter endpoints to check: 1) profile exists, 2) typeahead suggests you, 3) search finds your tweets, 4) your tweets are visible to others, 5) replies aren't deboosted.</div>}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-10">
          <a href="https://paypal.me/BDXII" target="_blank" rel="noopener noreferrer" className="bg-[#ffcc00] text-black rounded-full px-7 py-2.5 font-semibold text-[14px] shadow hover:bg-[#ffdb4d]">☕ Buy Me a Coffee</a>
          <button onClick={() => setShowCrypto(true)} className="bg-black text-white rounded-full px-7 py-2.5 text-[14px] shadow hover:bg-zinc-800">₿ Crypto</button>
        </div>

        <div className="text-center text-[12px] text-[#6a8aa8] mt-10">Made in Germany by <a href="https://x.com/shadowban_eu" target="_blank" className="text-[#2a7fb8]">@shadowban_eu</a>, rebuilt by <a href="https://x.com/gutnews247" target="_blank" className="text-[#2a7fb8]">@gutnews247</a></div>
      </div>

      {showCrypto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowCrypto(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-center text-lg">Donate Crypto</h3>
            <div><p className="text-xs font-bold mb-1">BTC</p><p className="text-[10px] break-all bg-zinc-100 p-2 rounded select-all">bc1qham6hxw6hx9p95rhq27nnzlmzyrr39w6p2gfm2</p></div>
            <div><p className="text-xs font-bold mb-1">ETH</p><p className="text-[10px] break-all bg-zinc-100 p-2 rounded select-all">0x438E7Be244e46D414f097B211cC4fa7549fB3C3b</p></div>
            <div><p className="text-xs font-bold mb-1">SOL</p><p className="text-[10px] break-all bg-zinc-100 p-2 rounded select-all">G2dYPPTMorSSoUb68fKYbX55pARzrT1FccRfjgYQFy9V</p></div>
            <button onClick={() => setShowCrypto(false)} className="w-full bg-black text-white rounded-full py-2.5 mt-2 hover:bg-zinc-800">Close</button>
          </div>
        </div>
      )}
    </main>
  )
}