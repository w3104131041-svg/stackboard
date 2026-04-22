'use client'

import { useMemo, useState } from 'react'

type Participant = {
  user_id: string
  display_name: string
  email: string
}

type ExistingResult = {
  user_id: string
  profit: number
  memo: string | null
}

export default function ResultForm({
  eventId,
  participants,
  existingResults,
}: {
  eventId: string
  participants: Participant[]
  existingResults: ExistingResult[]
}) {
  const initialRows = useMemo(() => {
    return participants.map((p) => {
      const existing = existingResults.find((r) => r.user_id === p.user_id)

      return {
        user_id: p.user_id,
        display_name: p.display_name,
        email: p.email,
        profit: existing?.profit?.toString() ?? '0',
        memo: existing?.memo ?? '',
      }
    })
  }, [participants, existingResults])

  const [rows, setRows] = useState(initialRows)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateRow = (userId: string, key: string, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.user_id === userId ? { ...row, [key]: value } : row
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch(`/api/admin/events/${eventId}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ results: rows }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || '収支の保存に失敗しました')
      return
    }

    setSuccess('収支を保存しました')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[1.75rem] border border-white/10 bg-[#111715] p-6 md:p-8"
    >
      <div className="grid gap-4">
        {rows.map((row) => (
          <div
            key={row.user_id}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="mb-4">
              <p className="text-lg font-semibold text-white">{row.display_name}</p>
              <p className="text-sm text-white/45">{row.email}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <div>
                <label className="mb-2 block text-sm text-white/70">収支</label>
                <input
                  type="number"
                  value={row.profit}
                  onChange={(e) => updateRow(row.user_id, 'profit', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0b0f0c] px-3 py-2 text-white outline-none"
                  placeholder="例: 5000 / -3000"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">メモ</label>
                <input
                  type="text"
                  value={row.memo}
                  onChange={(e) => updateRow(row.user_id, 'memo', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0b0f0c] px-3 py-2 text-white outline-none"
                  placeholder="任意"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? '保存中...' : '収支を保存する'}
      </button>
    </form>
  )
}