import { createClient } from '@/lib/supabase/server'

export async function getMyStats() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('results')
    .select('profit')
    .eq('user_id', user.id)
    .eq('is_confirmed', true)

  if (error) {
    console.error(error)
    return null
  }

  const total = (data ?? []).reduce(
    (sum, r) => sum + (r.profit ?? 0),
    0
  )

  return {
    total_profit: total,
    games: data?.length ?? 0,
  }
}

export async function getMyProfitSeries() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('results')
    .select('profit, confirmed_at')
    .eq('user_id', user.id)
    .eq('is_confirmed', true)
    .order('confirmed_at', { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  let running = 0

  return (data ?? []).map((row, i) => {
    running += row.profit ?? 0

    return {
      label: row.confirmed_at
        ? new Date(row.confirmed_at).toLocaleDateString('ja-JP')
        : `#${i + 1}`,
      value: running,
    }
  })
}

export async function getMyRecentResults() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('results')
    .select(`
      profit,
      event_id,
      events (
        title,
        event_date
      )
    `)
    .eq('user_id', user.id)
    .order('confirmed_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error(error)
    return []
  }

  return data ?? []
}