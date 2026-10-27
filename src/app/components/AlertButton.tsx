'use client'
import { useState } from 'react'

export default function AlertButton({ handle, platform }: { handle: string, platform: string }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) { setError('Enter a valid email'); return }
    if (!handle) { setError('Enter a username first'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), handle: handle.replace(/^@/, '').trim(), platform })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to save alert')
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="fixed bottom-6 right-6 bg-white border border-stone-200 shadow-xl rounded-2xl p-4 max-w-[320px] text-sm">
        <p className="font-semibold">✅ Confirmation email sent to {email}</p>
        <p className="text-xs text-stone-600 mt-1">This is a confirmation only. Ongoing monitoring is coming soon — we will email you when it launches. Check spam folder.</p>
        <button onClick={()=>setSent(false)} className="mt-2 text-xs underline">Close</button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white border border-stone-200 shadow-xl rounded-2xl p-4 max-w-[320px]">
      <p className="text-sm font-semibold">Get notified if visibility changes (beta)</p>
      <p className="text-[11px] text-stone-500 mt-1">We send a confirmation now. Real periodic monitoring is not yet implemented — this saves your request for future alerts. No spam.</p>
      <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email" className="flex-1 rounded-full border border-stone-300 px-3 py-1.5 text-sm" />
        <button disabled={loading} className="rounded-full bg-black text-white px-4 py-1.5 text-sm font-semibold disabled:opacity-50">{loading ? '...' : 'Notify me'}</button>
      </form>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  )
}
