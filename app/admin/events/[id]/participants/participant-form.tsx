'use client'

import { useState } from 'react'

export default function ParticipantForm({
  eventId,
  members,
  defaultSelectedIds,
}: {
  eventId: string
  members: Array<{ id: string; display_name: string; email: string | null }>
  defaultSelectedIds: string[]
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const toggleMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch(`/api/admin/events/${eventId}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_ids: selectedIds }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || '保存失敗')
      return
    }

    setSuccess('保存完了')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {members.map((m) => (
        <label
          key={m.id}
          className="flex justify-between border p-3 rounded-lg"
        >
          <div>
            <p>{m.display_name}</p>
            <p className="text-xs text-gray-400">{m.email}</p>
          </div>

          <input
            type="checkbox"
            checked={selectedIds.includes(m.id)}
            onChange={() => toggleMember(m.id)}
          />
        </label>
      ))}

      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-green-400">{success}</p>}

      <button
        type="submit"
        className="bg-yellow-400 text-black px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? '保存中...' : '参加者保存'}
      </button>
    </form>
  )
}