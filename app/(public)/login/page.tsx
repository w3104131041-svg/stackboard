'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError('ログインに失敗しました')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-bold">ログイン</h1>
      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm text-white/70">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            required
          />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#d4af37] px-4 py-3 font-medium text-black disabled:opacity-50"
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  )
}