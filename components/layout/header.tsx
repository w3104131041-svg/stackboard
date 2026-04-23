'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LogoutButton from './logout-button'

type Profile = {
  id: string
  display_name: string
  role: string
} | null

function StackboardLogo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3">
      <Image
        src="/icon-512.png"
        alt="StackBoard"
        width={44}
        height={44}
        className="h-11 w-11 rounded-xl object-cover shadow-[0_0_24px_rgba(16,185,129,0.18)]"
        priority
      />

      <div className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-[0.18em] text-white">
          STACKBOARD
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.24em] text-white/45">
          PRIVATE POKER COMMUNITY
        </span>
      </div>
    </Link>
  )
}

function MobileNavLink({
  href,
  children,
  onNavigate,
}: {
  href: string
  children: React.ReactNode
  onNavigate: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="text-base text-white/80 transition hover:text-white"
    >
      {children}
    </Link>
  )
}

export function Header() {
  return <ClientHeader />
}

function ClientHeader() {
  const supabase = createClient()
  const pathname = usePathname()
  const [user, setUser] = useState<Profile>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        setUser(null)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name, role')
        .eq('id', authUser.id)
        .single()

      setUser(profile ?? null)
    }

    load()
  }, [supabase])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className="border-b border-white/10 bg-[#05110d]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <StackboardLogo />

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/me/settings"
            className="text-sm text-white/75 transition hover:text-white"
          >
            プロフィール
          </Link>
          <Link
            href="/events"
            className="text-sm text-white/75 transition hover:text-white"
          >
            開催一覧
          </Link>
          <Link
            href="/rankings"
            className="text-sm text-white/75 transition hover:text-white"
          >
            ランキング
          </Link>
          <Link
            href="/members"
            className="text-sm text-white/75 transition hover:text-white"
          >
            メンバー
          </Link>
          <Link
            href="/me"
            className="text-sm text-white/75 transition hover:text-white"
          >
            マイページ
          </Link>

          {user?.role === 'admin' ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-white/75 transition hover:text-white"
              >
                管理画面
              </Link>
              <Link
                href="/admin/events/new"
                className="text-sm text-white/75 transition hover:text-white"
              >
                新規開催
              </Link>
            </>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {user.display_name}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                  {user.role}
                </p>
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

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="メニューを開く"
        >
          <span className="text-lg">{menuOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/8 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5">
            <MobileNavLink
              href="/me/settings"
              onNavigate={() => setMenuOpen(false)}
            >
              プロフィール
            </MobileNavLink>
            <MobileNavLink
              href="/events"
              onNavigate={() => setMenuOpen(false)}
            >
              開催一覧
            </MobileNavLink>
            <MobileNavLink
              href="/rankings"
              onNavigate={() => setMenuOpen(false)}
            >
              ランキング
            </MobileNavLink>
            <MobileNavLink
              href="/members"
              onNavigate={() => setMenuOpen(false)}
            >
              メンバー
            </MobileNavLink>
            <MobileNavLink
              href="/me"
              onNavigate={() => setMenuOpen(false)}
            >
              マイページ
            </MobileNavLink>

            {user?.role === 'admin' ? (
              <>
                <MobileNavLink
                  href="/dashboard"
                  onNavigate={() => setMenuOpen(false)}
                >
                  管理画面
                </MobileNavLink>
                <MobileNavLink
                  href="/admin/events/new"
                  onNavigate={() => setMenuOpen(false)}
                >
                  新規開催
                </MobileNavLink>
              </>
            ) : null}

            <div className="mt-2 border-t border-white/8 pt-4">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user.display_name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                      {user.role}
                    </p>
                  </div>
                  <LogoutButton />
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary inline-flex rounded-full px-4 py-2 text-sm font-medium"
                >
                  ログイン
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}