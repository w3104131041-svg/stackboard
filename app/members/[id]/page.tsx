import { createClient } from '@/lib/supabase/server'
import MemberProfitChart from './member-profit-chart'

function formatCurrency(value: number | null | undefined) {
  return `${(value ?? 0).toLocaleString()}円`
}

function getInitial(name: string | null | undefined) {
  if (!name) return '?'
  return name.trim().charAt(0).toUpperCase()
}

async function getMember(memberId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, email, avatar_url')
    .eq('id', memberId)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
}

async function getMemberResults(memberId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('results')
    .select(`
      id,
      profit,
      memo,
      confirmed_at,
      event_id,
      events!results_event_id_fkey (
        id,
        title,
        event_date,
        venue_name
      )
    `)
    .eq('user_id', memberId)
    .eq('is_confirmed', true)
    .order('confirmed_at', { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return data ?? []
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [member, results] = await Promise.all([
    getMember(id),
    getMemberResults(id),
  ])

  if (!member) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">メンバー詳細</h1>
        <p className="text-white/60">メンバーが見つかりませんでした。</p>
      </div>
    )
  }

  const totalProfit = results.reduce((sum: number, row: any) => sum + (row.profit ?? 0), 0)
  const gamesPlayed = results.length

  const chartData = results.map((row: any, index: number) => {
    const cumulative = results
      .slice(0, index + 1)
      .reduce((sum: number, r: any) => sum + (r.profit ?? 0), 0)

    return {
      label: row.events?.event_date ?? `#${index + 1}`,
      profit: row.profit ?? 0,
      cumulative,
    }
  })

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.display_name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d4af37] text-2xl font-semibold text-black">
              {getInitial(member.display_name)}
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]">
              Member Detail
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">
              {member.display_name}
            </h1>
            <p className="mt-2 text-sm text-white/60">{member.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/10 bg-[#111715] p-6">
          <p className="text-sm text-white/45">累計収支</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {formatCurrency(totalProfit)}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-[#111715] p-6">
          <p className="text-sm text-white/45">参加回数</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {gamesPlayed}回
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-[#111715] p-6">
          <p className="text-sm text-white/45">直近収支</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {results.length > 0
              ? formatCurrency(results[results.length - 1].profit)
              : '0円'}
          </p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-[#111715] p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">収支推移</h2>
        </div>

        <MemberProfitChart data={chartData} />
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-[#111715] p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">履歴</h2>
        </div>

        {results.length === 0 ? (
          <p className="text-sm text-white/60">まだ収支データがありません。</p>
        ) : (
          <div className="space-y-4">
            {[...results].reverse().map((row: any) => (
              <div
                key={row.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-lg font-medium text-white">
                    {row.events?.title ?? 'イベント'}
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    {row.events?.event_date ?? ''} / {row.events?.venue_name ?? ''}
                  </p>
                  {row.memo ? (
                    <p className="mt-2 text-sm text-white/55">メモ: {row.memo}</p>
                  ) : null}
                </div>

                <div className="text-right">
                  <p className="text-xl font-semibold text-white">
                    {formatCurrency(row.profit)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}