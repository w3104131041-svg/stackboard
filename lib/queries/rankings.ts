import { createClient } from '@/lib/supabase/server'

type RankingRow = {
  user_id: string
  display_name: string
  avatar_url?: string | null
  total_profit: number
  games_played: number
  avg_place?: number | null
}

type MonthlyRankingRow = {
  target_month: string
  user_id: string
  display_name: string
  avatar_url?: string | null
  total_profit: number
  games_played: number
  avg_place?: number | null
}

type ResultRow = {
  user_id: string
  profit: number | null
  confirmed_at: string | null
  profiles:
    | {
        display_name: string | null
      }
    | {
        display_name: string | null
      }[]
    | null
}

export async function getTotalRankings(): Promise<RankingRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('v_rankings_total')
    .select('user_id, display_name, avatar_url, total_profit, games_played, avg_place')
    .order('total_profit', { ascending: false })
    .order('games_played', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return (data ?? []) as RankingRow[]
}

export async function getMonthlyRankings(): Promise<MonthlyRankingRow[]> {
  const supabase = await createClient()

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const targetMonth = `${year}-${String(month).padStart(2, '0')}-01`

  const { data, error } = await supabase
    .from('v_rankings_monthly')
    .select('target_month, user_id, display_name, avatar_url, total_profit, games_played, avg_place')
    .eq('target_month', targetMonth)
    .order('total_profit', { ascending: false })
    .order('games_played', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return (data ?? []) as MonthlyRankingRow[]
}

export async function getAllMembersProfitSeries(mode: 'total' | 'monthly' = 'total') {
  const supabase = await createClient()

  let query = supabase
    .from('results')
    .select(`
      user_id,
      profit,
      confirmed_at,
      profiles!results_user_id_fkey (
        display_name
      )
    `)
    .eq('is_confirmed', true)
    .order('confirmed_at', { ascending: true })

  if (mode === 'monthly') {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    query = query.gte('confirmed_at', monthStart)
  }

  const { data, error } = await query

  if (error) {
    console.error(error)
    return {
      chartRows: [],
      memberNames: [],
    }
  }

  const rows = (data ?? []) as ResultRow[]

  const nameMap = new Map<string, string>()
  const userTotals = new Map<string, number>()

  for (const row of rows) {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
    const displayName = profile?.display_name ?? 'No Name'
    nameMap.set(row.user_id, displayName)
    userTotals.set(row.user_id, (userTotals.get(row.user_id) ?? 0) + (row.profit ?? 0))
  }

  const sortedUsers = [...userTotals.entries()].sort((a, b) => b[1] - a[1])
  const memberNames = sortedUsers.map(([userId]) => nameMap.get(userId) ?? userId)

  const runningTotals = new Map<string, number>()
  const chartRows: Array<Record<string, string | number>> = []

  rows.forEach((row, index) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
    const displayName = profile?.display_name ?? 'No Name'

    const nextTotal = (runningTotals.get(row.user_id) ?? 0) + (row.profit ?? 0)
    runningTotals.set(row.user_id, nextTotal)

    const pointLabel = row.confirmed_at
      ? new Date(row.confirmed_at).toLocaleDateString('ja-JP')
      : `#${index + 1}`

    const chartRow: Record<string, string | number> = {
      label: pointLabel,
    }

    memberNames.forEach((name) => {
      chartRow[name] = chartRows.length > 0
        ? (chartRows[chartRows.length - 1][name] as number | undefined) ?? 0
        : 0
    })

    chartRow[displayName] = nextTotal
    chartRows.push(chartRow)
  })

  return {
    chartRows,
    memberNames,
  }
}