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

type Row = {
  user_id: string
  display_name: string
  email: string
  sign: '+' | '-'
  amount: string
  memo: string
}

function toInitialSign(profit: number | null | undefined): '+' | '-' {
  return (profit ?? 0) < 0 ? '-' : '+'
}

function toAmount(profit: number | null | undefined) {
  return Math.abs(profit ?? 0).toString()
}

function toFinalProfit(sign: '+' | '-', amount: string) {
  const n = Number(amount || 0)
  return sign === '-' ? -Math.abs(n) : Math.abs(n)
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
  const initialRows = useMemo<Row[]>(() => {
    return participants.map((p) => {
      const existing = existingResults.find((r) => r.user_id === p.user_id)
      const profit = existing?.profit ?? 0

      return {
        user_id: p.user_id,
        display_name: p.display_name,
        email: p.email,
        sign: toInitialSign(profit),
        amount: toAmount(profit),
        memo: existing?.memo ?? '',
      }
    })
  }, [participants, existingResults])

  const [rows, setRows] = useState<Row[]>(initialRows)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateRow = (
    userId: string,
    key: 'sign' | 'amount' | 'memo',
    value: string
  ) => {
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

    const results = rows.map((row) => ({
      user_id: row.user_id,
      profit: toFinalProfit(row.sign, row.amount),
      memo: row.memo,
    }))

    const res = await fetch(`/api/admin/events/${eventId}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ results }),
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
              <p className="text-lg font-semibold text-white">
                {row.display_name}
              </p>
              <p className="text-sm text-white/45">{row.email}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  収支
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateRow(row.user_id, 'sign', '+')}
                    className={`h-11 rounded-xl px-4 text-sm font-semibold transition ${
                      row.sign === '+'
                        ? 'bg-emerald-400 text-black'
                        : 'border border-white/10 bg-white/5 text-white/55'
                    }`}
                  >
                    ＋
                  </button>

                  <button
                    type="button"
                    onClick={() => updateRow(row.user_id, 'sign', '-')}
                    className={`h-11 rounded-xl px-4 text-sm font-semibold transition ${
                      row.sign === '-'
                        ? 'bg-red-400 text-black'
                        : 'border border-white/10 bg-white/5 text-white/55'
                    }`}
                  >
                    −
                  </button>

                  <div className="flex flex-1 items-center rounded-xl border border-white/10 bg-[#0b0f0c] px-3">
                    <input
                      type="number"
                      min="0"
                      value={row.amount}
                      onChange={(e) =>
                        updateRow(row.user_id, 'amount', e.target.value)
                      }
                      className="w-full bg-transparent py-2 text-white outline-none"
                      placeholder="例: 5000"
                    />
                    <span className="text-sm text-white/45">pt</span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-white/40">
                  保存値:{' '}
                  {toFinalProfit(row.sign, row.amount).toLocaleString()}pt
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  メモ
                </label>
                <input
                  type="text"
                  value={row.memo}
                  onChange={(e) =>
                    updateRow(row.user_id, 'memo', e.target.value)
                  }
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