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
    alert('登録しました。ログインしてください。')
    setMode('login')
  }

  return (
    <div className="min-h-screen bg-[#eef3f1] text-[#102126]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-8 pt-16 pb-10">
        <div className="pt-8">
          <h1 className="text-6xl font-semibold tracking-[-0.05em] text-[#102126]">
            Booking
          </h1>
          <p className="mt-6 text-xl text-[#4e6369]">
            席予約システムにサインイン
          </p>
        </div>

        <div className="mt-12 inline-flex rounded-full bg-[#dfe8e6] p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-full px-8 py-4 text-lg font-semibold transition ${
              mode === 'login'
                ? 'bg-[#2a7f7d] text-white shadow-sm'
                : 'text-[#91a3a7]'
            }`}
          >
            ログイン
          </button>

          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-full px-8 py-4 text-lg font-semibold transition ${
              mode === 'signup'
                ? 'bg-[#2a7f7d] text-white shadow-sm'
                : 'text-[#91a3a7]'
            }`}
          >
            新規登録
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <div>
            <label className="mb-3 block text-lg font-medium text-[#31484e]">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mail@example.com"
              className="w-full rounded-2xl border border-[#b7cfcb] bg-white px-5 py-5 text-lg outline-none placeholder:text-[#a0acad]"
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-lg font-medium text-[#31484e]">
              パスワード
            </label>
            <div className="flex items-center rounded-2xl border border-[#b7cfcb] bg-white px-5">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                className="w-full bg-transparent py-5 text-lg outline-none placeholder:text-[#a0acad]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-3 text-2xl"
              >
                {showPassword ? '🙈' : '🙉'}
              </button>
            </div>
          </div>

          {error ? (
            <p className="text-base text-red-500">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#2a7f7d] px-6 py-5 text-2xl font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
          >
            {loading
              ? '処理中...'
              : mode === 'login'
              ? 'サインイン'
              : '新規登録'}
          </button>
        </form>

        <div className="mt-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfe8e6] text-xl">
            🌘
          </div>
        </div>
      </div>
    </div>
  )
}