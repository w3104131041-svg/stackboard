import { createClient } from '@/lib/supabase/server'
import ResultForm from './result-form'

async function getEvent(eventId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('id, title, event_date, venue_name')
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
        email
      )
    `)
    .eq('event_id', eventId)

  if (error) {
    console.error(error)
    return []
  }

  return (data ?? []).map((row: any) => ({
    user_id: row.user_id,
    display_name: row.profiles?.display_name ?? 'No Name',
    email: row.profiles?.email ?? '',
  }))
}

async function getExistingResults(eventId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('results')
    .select('user_id, profit, memo')
    .eq('event_id', eventId)

  if (error) {
    console.error(error)
    return []
  }

  return data ?? []
}

export default async function EventResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [event, participants, existingResults] = await Promise.all([
    getEvent(id),
    getParticipants(id),
    getExistingResults(id),
  ])

  if (!event) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">収支入力</h1>
        <p className="text-white/60">開催が見つかりませんでした。</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]">
          Results
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
          収支入力
        </h1>
        <p className="mt-3 text-sm text-white/60">
          {event.title} / {event.event_date} / {event.venue_name}
        </p>
      </div>

      <ResultForm
        eventId={id}
        participants={participants}
        existingResults={existingResults}
      />
    </div>
  )
}