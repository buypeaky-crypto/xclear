'use client'
import { useState } from 'react'
export default function AlertButton({ handle, platform }: { handle: string, platform: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')
  const [msg, setMsg] = useState('')
  async function submit() {
    if (!email ||!email.includes('@')) { setMsg('Enter valid email'); return }
    if (!handle) { setMsg('Enter handle first'); return }
    setStatus('loading'); setMsg('')
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, handle: handle.replace('@',''), platform: platform || 'x' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'failed')
      setStatus('ok'); setMsg('Alert saved! You will get emailed if banned again.'); setEmail('')
    } catch (e:any) {
      setStatus('error'); setMsg(e.message || 'Failed to save')
    }
  }
  return (
    <div className="mt-6 flex flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50 p-4">
      <div className="text- font-semibold text-stone-800">Get alerted if banned again</div>
      <div className="flex gap-2">
        <input type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} className="min-w-0 flex-1 rounded-md border border-stone-300 px-3 py-2 text- outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={submit} disabled={status==='loading'} className="rounded-md bg-blue-700 px-4 py-2 text- font-semibold text-white hover:bg-blue-800 disabled:opacity-50">{status==='loading'? 'Saving...' : 'Alert me'}</button>
      </div>
      {msg && <div className={`text- ${status==='ok'? 'text-green-700' : status==='error'? 'text-red-600' : 'text-stone-600'}`}>{msg}</div>}
    </div>
  )
}
