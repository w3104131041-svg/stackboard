import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './logout-button'

async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, role')
    .eq('id', user.id)
    .single()

  return profile ?? null
}

function StackboardLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 shrink-0">
      <div className="logo-mark-wrap">
        <div className="logo-mark">
          <span className="logo-layer logo-layer-1" />
          <span className="logo-layer logo-layer-2" />
          <span className="logo-layer logo-layer-3" />
        </div>
      </div>

      <div className="flex flex-col">
        <span className="logo-text">STACKBOARD</span>
        <span className="logo-subtext">PRIVATE POKER COMMUNITY</span>
      </div>
    </Link>
  )
}

export async function Header() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05110d]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-8">
          <StackboardLogo />

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/me/settings">プロフィール</Link>
            <Link href="/events" className="text-sm text-white/75 transition hover:text-white">
              開催一覧
            </Link>
            <Link href="/rankings" className="text-sm text-white/75 transition hover:text-white">
              ランキング
            </Link>
            <Link href="/members" className="text-sm text-white/75 transition hover:text-white">
              メンバー
            </Link>
            <Link href="/me" className="text-sm text-white/75 transition hover:text-white">
              マイページ
            </Link>
            {user?.role === 'admin' ? (
              <>
                <Link href="/dashboard" className="text-sm text-white/75 transition hover:text-white">
                  管理画面
                </Link>
                <Link href="/admin/events/new" className="text-sm text-white/75 transition hover:text-white">
                  新規開催
                </Link>
              </>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right md:block">
                <p className="text-sm font-medium text-white">{user.display_name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">{user.role}</p>
              </div>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="btn-primary rounded-full px-4 py-2 text-sm font-medium"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-white/8 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 py-3">
          <Link href="/me/settings">プロフィール</Link>
          <Link href="/events" className="whitespace-nowrap text-sm text-white/75 transition hover:text-white">
            開催一覧
          </Link>
          <Link href="/rankings" className="whitespace-nowrap text-sm text-white/75 transition hover:text-white">
            ランキング
          </Link>
          <Link href="/members" className="whitespace-nowrap text-sm text-white/75 transition hover:text-white">
            メンバー
          </Link>
          <Link href="/me" className="whitespace-nowrap text-sm text-white/75 transition hover:text-white">
            マイページ
          </Link>
          {user?.role === 'admin' ? (
            <>
              <Link href="/dashboard" className="whitespace-nowrap text-sm text-white/75 transition hover:text-white">
                管理画面
              </Link>
              <Link href="/admin/events/new" className="whitespace-nowrap text-sm text-white/75 transition hover:text-white">
                新規開催
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}