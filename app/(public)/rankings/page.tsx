import Link from 'next/link'
import {
  getAllMembersProfitSeries,
  getMonthlyRankings,
  getTotalRankings,
} from '@/lib/queries/rankings'
import RankingsProfitChart from './rankings-profit-chart'

type RankingPlayer = {
  user_id: string
  display_name: string
  avatar_url?: string | null
  total_profit: number
  games_played: number
  avg_place?: number | null
}

function formatPt(value: number | null | undefined) {
  return `${(value ?? 0).toLocaleString()}pt`
}

function getInitial(name: string | null | undefined) {
  if (!name) return '?'
  return name.trim().charAt(0).toUpperCase()
}

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const activeTab = tab === 'monthly' ? 'monthly' : 'total'

  const [totalRankings, monthlyRankings, graphResult] = await Promise.all([
    getTotalRankings(),
    getMonthlyRankings(),
    getAllMembersProfitSeries(activeTab === 'monthly' ? 'monthly' : 'total'),
  ])

  const rankings = activeTab === 'monthly' ? monthlyRankings : totalRankings
  const top3 = rankings.slice(0, 3)
  const rest = rankings.slice(3)

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-12 md:px-6 md:py-16">
      <section className="hero-shell rounded-[2rem] px-8 py-14 md:px-12 md:py-16">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-1" />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
              Ranking
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
              ランキング
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
              通算と月間のランキングに加えて、
              メンバー全体の推移をグラフで確認できます。
            </p>
          </div>

          <div className="inline-flex rounded-full border border-white/10 bg-black/20 p-1">
            <Link
              href="/rankings?tab=total"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'total'
                  ? 'btn-primary'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              通算
            </Link>

            <Link
              href="/rankings?tab=monthly"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'monthly'
                  ? 'btn-primary'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              月間
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
            Profit Graph
          </p>
          <h2 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
            全員の収支推移
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            表示メンバーを切り替えながら、累計pt推移を確認できます。
          </p>
        </div>

        <div className="soft-card rounded-[1.9rem] p-6 md:p-8">
          <RankingsProfitChart
            data={graphResult.chartRows}
            memberNames={graphResult.memberNames}
          />
        </div>
      </section>

      <section className="space-y-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
            Leaderboard
          </p>
          <h2 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
            {activeTab === 'monthly' ? '月間ランキング' : '通算ランキング'}
          </h2>
        </div>

        {rankings.length === 0 ? (
          <div className="soft-card rounded-[1.75rem] p-6 text-white/60">
            まだランキングデータがありません。
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {top3.map((player: RankingPlayer, index: number) => {
                const topCardClass = index === 0 ? 'neon-card' : 'soft-card'

                return (
                  <div
                    key={player.user_id}
                    className={`${topCardClass} rounded-[1.8rem] p-6 md:p-7`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.28em] text-white/40">
                        Rank
                      </span>
                      <span className="text-sm font-semibold text-emerald-300">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="mt-8 flex items-center gap-4">
                      {player.avatar_url ? (
                        <img
                          src={player.avatar_url}
                          alt={player.display_name}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-lg font-semibold text-emerald-200">
                          {getInitial(player.display_name)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-2xl font-semibold tracking-[-0.03em] text-white">
                          {player.display_name}
                        </p>
                        <p className="mt-1 text-sm text-white/45">
                          {player.games_played}回参加
                        </p>
                      </div>
                    </div>

                    <p className="mt-8 text-4xl font-semibold tracking-[-0.05em] text-white">
                      {formatPt(player.total_profit)}
                    </p>
                  </div>
                )
              })}
            </div>

            {rest.length > 0 ? (
              <div className="soft-card overflow-hidden rounded-[1.8rem]">
                {rest.map((player: RankingPlayer, index: number) => (
                  <div
                    key={player.user_id}
                    className="flex items-center justify-between gap-4 border-b border-white/8 px-6 py-5 last:border-b-0"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      {player.avatar_url ? (
                        <img
                          src={player.avatar_url}
                          alt={player.display_name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-semibold text-emerald-200">
                          {getInitial(player.display_name)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-sm text-emerald-300">#{index + 4}</p>
                        <p className="mt-1 truncate text-lg font-medium text-white">
                          {player.display_name}
                        </p>
                        <p className="mt-1 text-sm text-white/50">
                          {player.games_played}回
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">
                        {formatPt(player.total_profit)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}