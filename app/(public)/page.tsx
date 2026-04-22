import Link from 'next/link'
import { getUpcomingEvents, getRecentFinishedEvents } from '@/lib/queries/events'
import { getTotalRankings } from '@/lib/queries/rankings'

type RankingPlayer = {
  user_id: string
  display_name: string
  avatar_url?: string | null
  total_profit: number
  games_played: number
  avg_place?: number | null
}

type RecentResultEvent = {
  id: string
  title: string
  event_date: string
  venue_name: string
  status: string
  winner_name?: string | null
  winner_profit?: number | null
}

function formatCurrency(value: number | null | undefined) {
  return `${(value ?? 0).toLocaleString()}円`
}

export default async function HomePage() {
  const [events, rankings, recentResults] = await Promise.all([
    getUpcomingEvents(),
    getTotalRankings(),
    getRecentFinishedEvents(),
  ])

  const nextEvent = events[0]
  const top3 = rankings.slice(0, 3)

  return (
    <div className="mx-auto max-w-6xl space-y-28 px-4 py-12 md:px-6 md:py-16">
      {/* HERO */}
      <section className="hero-shell relative overflow-hidden rounded-[2.25rem] px-8 py-16 md:px-14 md:py-24">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />

        <div className="relative z-10 grid gap-14 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.36em] text-emerald-300/75">
              SWITCH YOUR STACK.
            </p>

            <h1 className="mt-6 text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-white md:text-7xl">
              仲間内でも、
              <br />
              ちゃんとした
              <br />
              サービスに。
            </h1>

            <p className="mt-8 max-w-2xl text-sm leading-7 text-white/62 md:text-base">
              開催、結果、収支、ランキング。
              熱量のあるホームゲームを、見える形で積み上げる。
              StackBoard は、仲間内のポーカー会をサービス品質で整えるための
              コミュニティプラットフォームです。
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/events"
                className="btn-primary rounded-full px-6 py-3 text-sm font-semibold"
              >
                開催一覧を見る
              </Link>

              <Link
                href="/rankings"
                className="btn-outline rounded-full px-6 py-3 text-sm font-semibold"
              >
                ランキングを見る
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-[1.8rem] p-6 md:p-7">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/42">
              NEXT EVENT
            </p>

            {nextEvent ? (
              <div className="mt-5 space-y-5">
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">
                    {nextEvent.title}
                  </h2>
                  <p className="mt-2 text-sm text-white/55">{nextEvent.venue_name}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">
                      Date
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {nextEvent.event_date}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">
                      Time
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {nextEvent.start_time ?? '未定'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-medium text-emerald-300">
                      {nextEvent.status}
                    </p>
                  </div>
                </div>

                <Link
                  href="/events"
                  className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/5"
                >
                  詳細を見る
                </Link>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  Schedule Updating
                </h2>
                <p className="text-sm leading-7 text-white/58">
                  次回開催情報は準備中です。公開されるとここに表示されます。
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="grid gap-10 md:grid-cols-[0.78fr_1.22fr] md:items-start">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
            PHILOSOPHY
          </p>
          <h2 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white">
            遊びを、
            <br />
            記録に変える。
          </h2>
        </div>

        <div className="max-w-3xl">
          <p className="text-base leading-8 text-white/68">
            ただ遊ぶだけでは終わらない。
            開催を整え、結果を残し、収支の流れを見える化する。
            仲間内のポーカー会を、個人管理ではなく、
            ちゃんとしたサービスとして運用するための基盤を作る。
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="soft-card rounded-[1.5rem] p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-white/38">Play On.</p>
              <h3 className="mt-5 text-2xl font-semibold text-white">
                熱量はそのまま
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/56">
                仲間内ならではの空気感や勝負の面白さはそのまま残す。
              </p>
            </div>

            <div className="soft-card rounded-[1.5rem] p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-white/38">Track Off.</p>
              <h3 className="mt-5 text-2xl font-semibold text-white">
                記録はスマートに
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/56">
                管理や振り返りは感覚ではなく、履歴と数字で積み上げる。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR FEATURES */}
      <section className="space-y-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
            OUR FEATURES
          </p>
          <h2 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
            StackBoardでできること
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            [
              '01',
              'Event Management',
              '開催を整える',
              '次回開催、会場、時間、ステータスをまとめて管理。',
            ],
            [
              '02',
              'Result Tracking',
              '収支を残す',
              '開催ごとの収支を入力して、履歴として蓄積。',
            ],
            [
              '03',
              'Ranking System',
              'ランキングで競う',
              '通算・月間での順位感覚を自然に可視化。',
            ],
            [
              '04',
              'Member Analytics',
              '流れを可視化する',
              'メンバー別の推移や参加傾向をグラフで確認。',
            ],
          ].map(([no, label, title, text]) => (
            <div key={no} className="soft-card rounded-[1.65rem] p-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-300/70">
                {no}
              </p>
              <p className="mt-5 text-xs uppercase tracking-[0.22em] text-white/35">
                {label}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/56">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT RESULTS */}
      <section className="space-y-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
              RECENT RESULTS
            </p>
            <h2 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
              最近の開催結果
            </h2>
          </div>

          <Link
            href="/events"
            className="hidden rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5 md:inline-flex"
          >
            開催一覧へ
          </Link>
        </div>

        {recentResults.length === 0 ? (
          <div className="soft-card rounded-[1.75rem] p-6 text-white/60">
            まだ開催結果がありません。
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {recentResults.map((event: RecentResultEvent) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="soft-card rounded-[1.75rem] p-6 transition hover:bg-[#16211c]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-white/38">
                    Finished
                  </span>
                  <span className="text-sm text-white/38">{event.event_date}</span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-white">
                  {event.title}
                </h3>

                <p className="mt-3 text-sm text-white/52">{event.venue_name}</p>

                <div className="mt-8 rounded-2xl bg-black/20 p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/36">
                    Winner
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {event.winner_name ?? '未登録'}
                  </p>
                  <p className="mt-2 text-sm text-emerald-300">
                    {event.winner_profit !== null
                      ? formatCurrency(event.winner_profit)
                      : '収支未登録'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* WHO WE ARE */}
      <section className="grid gap-10 md:grid-cols-[0.78fr_1.22fr] md:items-start">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
            WHO WE ARE
          </p>
          <h2 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white">
            小さくても、
            <br />
            雑にはしない。
          </h2>
        </div>

        <div className="soft-card rounded-[1.9rem] p-8 md:p-10">
          <p className="text-base leading-8 text-white/66">
            StackBoard は、大きなコミュニティのためだけのものではありません。
            仲間内のホームゲームでも、開催導線や収支管理、ランキング表示まで
            きれいに整えることで、継続のしやすさと楽しさが変わる。
            小さな集まりを、ちゃんとした価値ある場にするためのサービスです。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-black/20 p-5">
              <p className="text-sm text-white/40">Members</p>
              <p className="mt-2 text-2xl font-semibold text-white">Community Base</p>
            </div>
            <div className="rounded-2xl bg-black/20 p-5">
              <p className="text-sm text-white/40">Records</p>
              <p className="mt-2 text-2xl font-semibold text-white">Stack History</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-shell relative overflow-hidden rounded-[2rem] px-8 py-14 md:px-12 md:py-16">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-1" />

        <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
              READY TO JOIN?
            </p>
            <h2 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
              次回開催に参加する
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/64 md:text-base">
              開催も、収支も、ランキングも、あとから見返したくなる形で。
              仲間内だからこそ、きれいに続ける。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="btn-primary rounded-full px-6 py-3 text-sm font-semibold"
            >
              ログイン
            </Link>
            <Link
              href="/events"
              className="btn-outline rounded-full px-6 py-3 text-sm font-semibold"
            >
              開催一覧
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}