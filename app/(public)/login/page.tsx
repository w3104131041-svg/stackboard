'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      setLoading(false)

      if (error) {
        setError(error.message)
        return
      }

      router.push('/me')
      router.refresh()
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }

    const userId = data.user?.id

    if (userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        email,
        display_name: email.split('@')[0],
        role: 'member',
        is_active: true,
      })
    }

    setLoading(false)

    if (data.session) {
      router.push('/me/settings?setup=1')
      router.refresh()
      return
    }

    alert('登録しました。メール確認後にログインしてください。')
    setMode('login')
  }

  return (
    <div className="min-h-screen bg-[#05110d] text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
        <div className="w-full">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
              StackBoard
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">
              ログイン
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/55">
              開催、結果、収支、ランキングをまとめて管理
            </p>
          </div>

          <div className="soft-card mt-10 rounded-[2rem] p-6 md:p-8">
            <div className="flex rounded-full bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
                  mode === 'login'
                    ? 'bg-emerald-500 text-black'
                    : 'text-white/40'
                }`}
              >
                ログイン
              </button>

              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
                  mode === 'signup'
                    ? 'bg-emerald-500 text-black'
                    : 'text-white/40'
                }`}
              >
                新規登録
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="text-sm text-white/60">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                  placeholder="mail@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-white/60">
                  パスワード
                </label>
                <div className="mt-2 flex items-center rounded-xl border border-white/10 bg-black/30 px-4">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent py-3 outline-none"
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-3 text-lg"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error ? (
                <p className="text-sm text-red-400">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full rounded-full py-4 text-base font-semibold disabled:opacity-60"
              >
                {loading
                  ? '処理中...'
                  : mode === 'login'
                  ? 'ログイン'
                  : '新規登録'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}