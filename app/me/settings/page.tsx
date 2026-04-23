'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function getInitial(name: string | null | undefined) {
  if (!name) return '?'
  return name.trim().charAt(0).toUpperCase()
}

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isFirstSetup = searchParams.get('setup') === '1'

  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error(error)
      return
    }

    if (data) {
      setName(data.display_name || '')
      setAvatarUrl(data.avatar_url || '')
      setPreviewUrl(data.avatar_url || '')
    }
  }

  const handleUpload = async (file: File) => {
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/profile/avatar', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    setUploading(false)

    if (!res.ok) {
      alert(data.error || '画像アップロードに失敗しました')
      return
    }

    setAvatarUrl(data.avatar_url)
    setPreviewUrl(data.avatar_url)
  }

  const handleSave = async () => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: name || 'No Name',
        avatar_url: avatarUrl,
      })
      .eq('id', user.id)

    setLoading(false)

    if (error) {
      console.error(error)
      alert('保存に失敗しました')
      return
    }

    router.push('/me')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-12">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
          PROFILE
        </p>
        <h1 className="mt-4 text-4xl font-semibold">プロフィール設定</h1>
        {isFirstSetup ? (
          <p className="mt-4 text-sm text-white/60">
            最初に表示名とアイコンを設定してください。
          </p>
        ) : null}
      </div>

      <div className="soft-card rounded-2xl p-6 space-y-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="avatar"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-400/15 text-3xl font-semibold text-emerald-200">
                {getInitial(name)}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="btn-outline inline-flex cursor-pointer rounded-full px-5 py-3 text-sm font-medium">
              {uploading ? 'アップロード中...' : '画像をアップロード'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleUpload(file)
                }}
              />
            </label>

            <p className="text-sm text-white/50">
              jpg / png / webp に対応
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm text-white/60">名前</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl bg-black/20 px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm text-white/60">アイコンURL</label>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="mt-2 w-full rounded-xl bg-black/20 px-4 py-3"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary rounded-full px-6 py-3"
        >
          {loading ? '保存中...' : '保存してマイページへ'}
        </button>
      </div>
    </div>
  )
}