import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

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

async function getEvents() {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('id, title, event_date, start_time, venue_name, status')
    .order('event_date', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  if (!events?.length) {
    return []
  }

  const eventIds = events.map((event) => event.id)

  const { data: participants, error: participantError } = await supabase
    .from('event_participants')
    .select('event_id')
    .in('event_id', eventIds)

  if (participantError) {
    console.error(participantError)
  }

  return events.map((event) => {
    const count =
      participants?.filter((participant) => participant.event_id === event.id)
        .length ?? 0

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

    return {
      ...event,
      participant_count: count,
      effectiveStatus,
      isJoinable,
    }
  })
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-12 md:px-6 md:py-16">
      <section className="hero-shell rounded-[2rem] px-8 py-14 md:px-12 md:py-16">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-1" />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
              Events
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
              開催一覧
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
              次回開催の確認、詳細確認、参加、結果入力までここから行えます。
            </p>
          </div>

          <Link
            href="/admin/events/new"
            className="btn-primary rounded-full px-5 py-3 text-sm font-semibold"
          >
            新規開催
          </Link>
        </div>
      </section>

      {events.length === 0 ? (
        <div className="soft-card rounded-[1.75rem] p-6 text-white/60">
          まだ開催データがありません。
        </div>
      ) : (
        <section className="space-y-6">
          {events.map((event: any) => (
            <div
              key={event.id}
              className="soft-card rounded-[1.75rem] p-6 md:p-7"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${getStatusClass(event.effectiveStatus)}`}
                    >
                      {getStatusLabel(event.effectiveStatus)}
                    </span>

                    <span className="text-sm text-white/45">
                      {event.event_date}
                    </span>

                    {event.start_time ? (
                      <span className="text-sm text-white/45">
                        {event.start_time}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
                    {event.title}
                  </h2>

                  <p className="text-sm text-white/60">
                    会場: {event.venue_name}
                  </p>

                  <p className="text-sm text-white/50">
                    参加人数: {event.participant_count}名
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/events/${event.id}`}
                    className="btn-outline rounded-full px-4 py-2 text-sm font-medium"
                  >
                    詳細
                  </Link>

                  <Link
                    href={`/admin/events/${event.id}/participants`}
                    className="btn-outline rounded-full px-4 py-2 text-sm font-medium"
                  >
                    参加者登録
                  </Link>

                  {event.effectiveStatus !== 'draft' ? (
                    <Link
                      href={`/admin/events/${event.id}/results`}
                      className="btn-primary rounded-full px-4 py-2 text-sm font-medium"
                    >
                      結果入力
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}