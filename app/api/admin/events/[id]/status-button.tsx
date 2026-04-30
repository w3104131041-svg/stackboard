'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function StatusButton({
  eventId,
  currentStatus,
}: {
  eventId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const updateStatus = async (status: string) => {
    setLoading(true)

    const res = await fetch(`/api/admin/events/${eventId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      alert(data.error || '更新に失敗しました')
      return
    }

    router.refresh()
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        disabled={loading || currentStatus === 'open'}
        onClick={() => updateStatus('open')}
        className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-black disabled:opacity-40"
      >
        募集中にする
      </button>

      <button
        type="button"
        disabled={loading || currentStatus === 'closed'}
        onClick={() => updateStatus('closed')}
        className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-black disabled:opacity-40"
      >
        締切にする
      </button>

      <button
        type="button"
        disabled={loading || currentStatus === 'finished'}
        onClick={() => updateStatus('finished')}
        className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-black disabled:opacity-40"
      >
        開催済みにする
      </button>
    </div>
  )
}