'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function JoinButton({
  eventId,
  joined,
}: {
  eventId: string
  joined: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)

    const res = await fetch(`/api/events/${eventId}/join`, {
      method: joined ? 'DELETE' : 'POST',
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      alert(data?.error || '操作に失敗しました')
      return
    }

    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={
        joined
          ? 'btn-outline rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-50'
          : 'btn-primary rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-50'
      }
    >
      {loading ? '処理中...' : joined ? '参加を取り消す' : '参加する'}
    </button>
  )
}