import { createClient } from '@/lib/supabase/server'
import JoinButton from './join-button'

function getEventCloseInfo(eventDate: string, startTime: string | null) {
  if (!eventDate) {
    return {
      effectiveStatus: 'draft',
      isJoinable: false,
    }
  }

  const start = new Date(
    startTime ? `${eventDate}T${startTime}:00` : `${eventDate}T00:00:00`
  )

  const closeAt = new Date(start.getTime() - 2 * 60 * 60 * 1000)
  const now = new Date()

  if (now >= start) {
    return {
      effectiveStatus: 'finished',
      isJoinable: false,
    }
  }

  if (now >= closeAt) {
    return {
      effectiveStatus: 'closed',
      isJoinable: false,
    }
  }

  return {
    effectiveStatus: 'open',
    isJoinable: true,
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'open':
      return '募集中'
    case 'closed':
      return '締切'
    case 'finished':
      return '開催済み'
    case 'draft':
      return '下書き'
    default:
      return status
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'open':
      return 'bg-emerald-400/10 text-emerald-300'
    case 'closed':
      return 'bg-amber-400/10 text-amber-300'
    case 'finished':
      return 'bg-cyan-400/10 text-cyan-300'
    case 'draft':
      return 'bg-white/10 text-white/60'
    default:
      return 'bg-white/10 text-white/60'
  }
}

async function getEvent(eventId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select(`
      id,
      title,
      event_date,
      start_time,
      venue_name,
      venue_address,
      buy_in,
      rebuy_rule,
      note,
      status
    `)
    .eq('id', eventId)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
}

async function getParticipants(eventId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('event_participants')
    .select(`
      user_id,
      profiles!event_participants_user_id_fkey (
        id,
        display_name,
        email,
        avatar_url
      )
    `)
    .eq('event_id', eventId)

  if (error) {
    console.error(error)
    return []
  }

  return (data ?? []).map((row: any) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles

    return {
      user_id: row.user_id,
      display_name: profile?.display_name ?? 'No Name',
      email: profile?.email ?? '',
      avatar_url: profile?.avatar_url ?? '',
    }
  })
}

async function getResults(eventId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('results')
    .select(`
      user_id,
      place,
      buy_in_total,
      cash_out,
      profit,
      memo,
      profiles!results_user_id_fkey (
        id,
        display_name,
        email,
        avatar_url
      )
    `)
    .eq('event_id', eventId)
    .order('profit', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return (data ?? []).map((row: any) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles

    return {
      user_id: row.user_id,
      place: row.place,
      buy_in_total: row.buy_in_total,
      cash_out: row.cash_out,
      profit: row.profit,
      memo: row.memo,
      display_name: profile?.display_name ?? 'No Name',
      email: profile?.email ?? '',
      avatar_url: profile?.avatar_url ?? '',
    }
  })
}

async function getJoinState(eventId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { joined: false, currentUserId: null as string | null }
  }

  const { data } = await supabase
    .from('event_participants')
    .select('user_id')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .maybeSingle()

  return {
    joined: !!data,
    currentUserId: user.id,
  }
}

function formatPt(value: number | null | undefined) {
  return `${(value ?? 0).toLocaleString()}pt`
}

function getInitial(name: string | null | undefined) {
  if (!name) return '?'
  return name.trim().charAt(0).toUpperCase()
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [event, participants, results, joinState] = await Promise.all([
    getEvent(id),
    getParticipants(id),
    getResults(id),
    getJoinState(id),
  ])

  if (!event) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">開催詳細</h1>
        <p className="text-white/60">開催が見つかりませんでした。</p>
      </div>
    )
  }

  let effectiveStatus = event.status
  let isJoinable = false

  if (event.status === 'draft' || event.status === 'finished') {
    effectiveStatus = event.status
    isJoinable = false
  } else {
    const closeInfo = getEventCloseInfo(event.event_date, event.start_time)
    effectiveStatus = closeInfo.effectiveStatus
    isJoinable = closeInfo.isJoinable
  }

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-12 md:px-6 md:py-16">
      <section className="hero-shell rounded-[2rem] px-8 py-14 md:px-12 md:py-16">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-1" />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
                Event Detail
              </p>

              <span
                className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${getStatusClass(effectiveStatus)}`}
              >
                {getStatusLabel(effectiveStatus)}
              </span>
            </div>

            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
              {event.title}
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/62">
              {event.event_date}
              {event.start_time ? ` / ${event.start_time}` : ''}
              {' / '}
              {event.venue_name}
            </p>
          </div>

          {isJoinable ? (
            <JoinButton eventId={event.id} joined={joinState.joined} />
          ) : (
            <div className="rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm text-white/55">
              {effectiveStatus === 'closed' && '現在は締切です'}
              {effectiveStatus === 'finished' && 'この開催は終了しています'}
              {effectiveStatus === 'draft' && 'この開催は公開前です'}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="soft-card rounded-[1.8rem] p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-300/75">
            Event Info
          </p>

          <div className="mt-6 space-y-4 text-sm text-white/65">
            <p>状態: {getStatusLabel(effectiveStatus)}</p>
            <p>会場名: {event.venue_name}</p>
            <p>住所: {event.venue_address ?? '未設定'}</p>
            <p>参加費: {formatPt(event.buy_in)}</p>
            <p>リバイ: {event.rebuy_rule ?? '未設定'}</p>
            <p>備考: {event.note ?? 'なし'}</p>
          </div>
        </div>

        <div className="soft-card rounded-[1.8rem] p-6 md:p-8">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-300/75">
              Participants
            </p>
            <p className="text-sm text-white/50">{participants.length}名</p>
          </div>

          <div className="mt-6 space-y-3">
            {participants.length === 0 ? (
              <p className="text-sm text-white/60">
                参加者はまだ登録されていません。
              </p>
            ) : (
              participants.map((participant) => (
                <div
                  key={participant.user_id}
                  className="flex items-center gap-4 rounded-2xl bg-black/20 px-4 py-3"
                >
                  {participant.avatar_url ? (
                    <img
                      src={participant.avatar_url}
                      alt={participant.display_name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/12 text-sm font-semibold text-emerald-200">
                      {getInitial(participant.display_name)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-medium text-white">
                      {participant.display_name}
                    </p>
                    <p className="truncate text-sm text-white/45">
                      {participant.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
            Results
          </p>
          <h2 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
            開催結果
          </h2>
        </div>

        <div className="soft-card rounded-[1.8rem] p-6 md:p-8">
          {results.length === 0 ? (
            <p className="text-sm text-white/60">
              まだ結果は登録されていません。
            </p>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.user_id}
                  className="flex flex-col gap-4 rounded-2xl bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    {result.avatar_url ? (
                      <img
                        src={result.avatar_url}
                        alt={result.display_name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/12 text-sm font-semibold text-emerald-200">
                        {getInitial(result.display_name)}
                      </div>
                    )}

                    <div>
                      <p className="text-lg font-semibold text-white">
                        {result.display_name}
                      </p>
                      <p className="text-sm text-white/45">{result.email}</p>
                      {result.memo ? (
                        <p className="mt-1 text-sm text-white/50">
                          メモ: {result.memo}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-white/40">Profit</p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {formatPt(result.profit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}