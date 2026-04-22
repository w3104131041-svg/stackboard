import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

function formatPt(value: number | null | undefined) {
  return `${(value ?? 0).toLocaleString()}pt`
}

function getInitial(name: string | null | undefined) {
  if (!name) return '?'
  return name.trim().charAt(0).toUpperCase()
}

async function getMembersWithStats() {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from('profiles')
    .select('id, display_name, email, avatar_url, is_active')
    .eq('is_active', true)
    .order('display_name', { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  const memberIds = (members ?? []).map((m) => m.id)

  if (!memberIds.length) {
    return []
  }

  const { data: results, error: resultsError } = await supabase
    .from('results')
    .select('user_id, profit')
    .in('user_id', memberIds)
    .eq('is_confirmed', true)

  if (resultsError) {
    console.error(resultsError)
  }

  return (members ?? [])
    .map((member: any) => {
      const myResults = (results ?? []).filter((r: any) => r.user_id === member.id)
      const totalProfit = myResults.reduce(
        (sum: number, row: any) => sum + (row.profit ?? 0),
        0
      )

      return {
        ...member,
        totalProfit,
        gamesPlayed: myResults.length,
      }
    })
    .sort((a, b) => b.totalProfit - a.totalProfit)
}

export default async function MembersPage() {
  const members = await getMembersWithStats()
  const top3 = members.slice(0, 3)
  const rest = members.slice(3)

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-12 md:px-6 md:py-16">
      <section className="hero-shell rounded-[2rem] px-8 py-14 md:px-12 md:py-16">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-1" />

        <div className="relative z-10">
          <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
            Members
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
            メンバー一覧
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
            参加メンバーの累計ptと参加回数を一覧で確認できます。
            個別ページでは、推移グラフや履歴も見られます。
          </p>
        </div>
      </section>

      {members.length === 0 ? (
        <div className="soft-card rounded-[1.75rem] p-6 text-white/60">
          メンバーがまだ登録されていません。
        </div>
      ) : (
        <>
          <section className="space-y-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
                Top Members
              </p>
              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
                上位メンバー
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {top3.map((member: any, index: number) => {
                const cardClass = index === 0 ? 'neon-card' : 'soft-card'

                return (
                  <Link
                    key={member.id}
                    href={`/members/${member.id}`}
                    className={`${cardClass} rounded-[1.8rem] p-6 md:p-7 transition hover:translate-y-[-2px]`}
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
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.display_name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-xl font-semibold text-emerald-200">
                          {getInitial(member.display_name)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-2xl font-semibold tracking-[-0.03em] text-white">
                          {member.display_name}
                        </p>
                        <p className="mt-1 truncate text-sm text-white/45">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                          Total
                        </p>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                          {formatPt(member.totalProfit)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                          Games
                        </p>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                          {member.gamesPlayed}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          {rest.length > 0 ? (
            <section className="space-y-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
                  All Members
                </p>
                <h2 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
                  すべてのメンバー
                </h2>
              </div>

              <div className="soft-card overflow-hidden rounded-[1.8rem]">
                {rest.map((member: any, index: number) => (
                  <Link
                    key={member.id}
                    href={`/members/${member.id}`}
                    className="flex items-center justify-between gap-4 border-b border-white/8 px-6 py-5 transition hover:bg-white/[0.02] last:border-b-0"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.display_name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/12 text-sm font-semibold text-emerald-200">
                          {getInitial(member.display_name)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-sm text-emerald-300">#{index + 4}</p>
                        <p className="mt-1 truncate text-lg font-medium text-white">
                          {member.display_name}
                        </p>
                        <p className="mt-1 truncate text-sm text-white/45">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">
                        {formatPt(member.totalProfit)}
                      </p>
                      <p className="mt-1 text-sm text-white/50">
                        {member.gamesPlayed}回
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}