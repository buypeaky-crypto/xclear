"use client"
import { useState } from "react"
import { Search, CheckCircle, AlertCircle, Coffee } from "lucide-react"

export default function Home() {
  const [handle, setHandle] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const check = async () => {
    if (!handle) return
    setLoading(true)
    const res = await fetch(`/api/check?handle=${handle}`)
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-2">xClear</h1>
      <p className="text-zinc-400 mb-8">Check if you're shadowbanned on X in 6ms</p>
      
      <div className="flex gap-2 w-full max-w-md">
        <input
          value={handle}
          onChange={e => setHandle(e.target.value)}
          placeholder="@peaky"
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 outline-none"
        />
        <button
          onClick={check}
          disabled={loading}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          <Search size={18} /> {loading ? "..." : "Check"}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-4 w-full max-w-md">
          {result.status === "clear" ? (
            <div className="flex gap-2 text-green-400"><CheckCircle size={20}/> @{result.handle} looks clear</div>
          ) : (
            <div className="flex gap-2 text-red-400"><AlertCircle size={20}/> Shadowban detected</div>
          )}
          <p className="text-xs text-zinc-500 mt-2">Checked at {new Date(result.checkedAt).toLocaleTimeString()}</p>
        </div>
      )}

      <div className="mt-12 flex flex-col items-center gap-3">
        <a
          href="https://buymeacoffee.com/buypeaky"
          target="_blank"
          className="bg-[#FFDD00] text-black px-6 py-3 rounded-full font-bold flex items-center gap-2"
        >
          <Coffee size={18}/> Buy Me a Coffee
        </a>
        <p className="text-xs text-zinc-600">Free checks forever - Support keeps edge cache fast</p>
      </div>
    </main>
  )
}