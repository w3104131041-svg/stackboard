import {
  getMyProfitSeries,
  getMyRecentResults,
  getMyStats,
} from '@/lib/queries/mypage'
import MyProfitChart from './my-profit-chart'

function formatPt(v: number) {
  return `${v.toLocaleString()}pt`
}

export default async function MyPage() {
  const [stats, series, recent] = await Promise.all([
    getMyStats(),
    getMyProfitSeries(),
    getMyRecentResults(),
  ])

  if (!stats) {
    return <p>ログインしてください</p>
  }

  return (
    <div className="mx-auto max-w-5xl space-y-20 px-4 py-12">
      <div>
        <p className="text-emerald-300 text-xs tracking-[0.3em] uppercase">
          MY PAGE
        </p>
        <h1 className="mt-4 text-5xl font-semibold">マイページ</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="soft-card rounded-2xl p-6">
          <p className="text-sm text-white/50">総収支</p>
          <p className="mt-3 text-3xl font-semibold">
            {formatPt(stats.total_profit)}
          </p>
        </div>

        <div className="soft-card rounded-2xl p-6">
          <p className="text-sm text-white/50">参加回数</p>
          <p className="mt-3 text-3xl font-semibold">
            {stats.games}回
          </p>
        </div>

        <div className="soft-card rounded-2xl p-6">
          <p className="text-sm text-white/50">直近収支</p>
          <p className="mt-3 text-3xl font-semibold">
            {recent.length > 0 ? formatPt(recent[0].profit ?? 0) : '0pt'}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-3xl font-semibold">収支推移</h2>

        <div className="soft-card rounded-2xl p-6">
          <MyProfitChart data={series} />
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-3xl font-semibold">履歴</h2>

        <div className="space-y-4">
          {recent.map((r: any, i: number) => (
            <div
              key={i}
              className="soft-card flex justify-between rounded-xl p-4"
            >
              <div>
                <p>{r.events?.title}</p>
                <p className="text-sm text-white/50">
                  {r.events?.event_date}
                </p>
              </div>

              <p className="font-semibold">
                {formatPt(r.profit ?? 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}