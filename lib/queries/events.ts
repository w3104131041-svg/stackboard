import { createClient } from '@/lib/supabase/server'

type EventRow = {
  id: string
  title: string
  event_date: string
  start_time: string | null
  venue_name: string
  status: string
}

type FinishedEventRow = {
  id: string
  title: string
  event_date: string
  venue_name: string
  status: string
}

type RecentFinishedEventResult = FinishedEventRow & {
  winner_name: string | null
  winner_profit: number | null
}

export async function getUpcomingEvents(): Promise<EventRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('id, title, event_date, start_time, venue_name, status')
    .in('status', ['open', 'closed'])
    .order('event_date', { ascending: true })
    .limit(4)

  if (error) {
    console.error(error)
    return []
  }

  return (data ?? []) as EventRow[]
}

export async function getRecentFinishedEvents(): Promise<RecentFinishedEventResult[]> {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('id, title, event_date, venue_name, status')
    .eq('status', 'finished')
    .order('event_date', { ascending: false })
    .limit(3)

  if (error) {
    console.error(error)
    return []
  }

  const finishedEvents = ((events ?? []) as FinishedEventRow[])

  if (!finishedEvents.length) {
    return []
  }

  const eventIds = finishedEvents.map((event) => event.id)

  const { data: results, error: resultsError } = await supabase
    .from('results')
    .select(`
      event_id,
      profit,
      profiles!results_user_id_fkey (
        display_name
      )
    `)
    .in('event_id', eventIds)
    .eq('is_confirmed', true)

  if (resultsError) {
    console.error(resultsError)
    return finishedEvents.map((event) => ({
      ...event,
      winner_name: null,
      winner_profit: null,
    }))
  }

  return finishedEvents.map((event) => {
    const eventResults: any[] =
      (results ?? []).filter((row: any) => row.event_id === event.id)

    const winner: any = eventResults.sort(
      (a: any, b: any) => (b.profit ?? 0) - (a.profit ?? 0)
    )[0]

    const winnerProfiles: any = winner?.profiles

    const winnerName = Array.isArray(winnerProfiles)
      ? winnerProfiles[0]?.display_name ?? null
      : winnerProfiles?.display_name ?? null

    return {
      ...event,
      winner_name: winnerName,
      winner_profit: winner?.profit ?? null,
    }
  })
}