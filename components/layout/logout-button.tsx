'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)

    await fetch('/api/auth/logout', {
      method: 'POST',
    })

    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5 disabled:opacity-50"
    >
      {loading ? 'ログアウト中...' : 'ログアウト'}
    </button>
  )
}