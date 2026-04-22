'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const timeOptions = [
  '12:00','13:00','14:00','15:00','16:00',
  '17:00','18:00','19:00','20:00','21:00','22:00','23:00',
]

// 🔥 日付生成
function generateDateOptions(days = 30) {
  const list: { label: string; value: string }[] = []

  const today = new Date()

  for (let i = 0; i < days; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)

    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')

    const value = `${yyyy}-${mm}-${dd}`

    const week = ['日','月','火','水','木','金','土'][d.getDay()]

    const label = `${value}（${week}）`

    list.push({ label, value })
  }

  return list
}

const dateOptions = generateDateOptions(30)

export default function NewEventPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [venueName, setVenueName] = useState('')
  const [venueAddress, setVenueAddress] = useState('')
  const [buyIn, setBuyIn] = useState('3000')
  const [status, setStatus] = useState('open')
  const [rebuyRule, setRebuyRule] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!eventDate || !startTime) {
      setError('開催日と開催時間は必須です')
      return
    }

    setLoading(true)

    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        event_date: eventDate,
        start_time: startTime,
        venue_name: venueName,
        venue_address: venueAddress,
        buy_in: buyIn,
        status,
        rebuy_rule: rebuyRule,
        note,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || '開催の保存に失敗しました')
      return
    }

    router.push('/events')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
      <div>
        <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
          New Event
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
          開催作成
        </h1>
        <p className="mt-4 text-sm text-white/60">
          日付と時間だけ選べばすぐ作れます
        </p>
      </div>

      <form onSubmit={handleSubmit} className="soft-card rounded-[2rem] p-8 md:p-10">
        <div className="grid gap-6 md:grid-cols-2">

          {/* タイトル */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-white/70">
              開催タイトル
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例）4月ホームゲーム"
              className="w-full rounded-2xl bg-black/20 px-4 py-3 outline-none"
            />
          </div>

          {/* 🔥 日付プルダウン */}
          <div>
            <label className="mb-2 block text-sm text-white/70">
              開催日 <span className="text-emerald-300">*</span>
            </label>
            <select
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-2xl bg-black/20 px-4 py-3 outline-none"
              required
            >
              <option value="">選択してください</option>
              {dateOptions.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* 時間 */}
          <div>
            <label className="mb-2 block text-sm text-white/70">
              開催時間 <span className="text-emerald-300">*</span>
            </label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-2xl bg-black/20 px-4 py-3 outline-none"
              required
            >
              <option value="">選択してください</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* 以下そのまま */}
          <div>
            <label className="mb-2 block text-sm text-white/70">会場名</label>
            <input
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="例）池袋ルーム"
              className="w-full rounded-2xl bg-black/20 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">会場住所</label>
            <input
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              placeholder="例）東京都..."
              className="w-full rounded-2xl bg-black/20 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">バイイン</label>
            <input
              type="number"
              value={buyIn}
              onChange={(e) => setBuyIn(e.target.value)}
              className="w-full rounded-2xl bg-black/20 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">状態</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-2xl bg-black/20 px-4 py-3 outline-none"
            >
              <option value="open">募集中</option>
              <option value="closed">締切</option>
              <option value="finished">開催済み</option>
              <option value="draft">下書き</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-white/70">リバイ説明</label>
            <input
              value={rebuyRule}
              onChange={(e) => setRebuyRule(e.target.value)}
              placeholder="例）1回まで"
              className="w-full rounded-2xl bg-black/20 px-4 py-3 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-white/70">備考</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full rounded-2xl bg-black/20 px-4 py-3 outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="mt-6 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-8 rounded-full px-6 py-3"
        >
          {loading ? '保存中...' : '開催を保存する'}
        </button>
      </form>
    </div>
  )
}