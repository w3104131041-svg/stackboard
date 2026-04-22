'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function getInitial(name: string | null | undefined) {
  if (!name) return '?'
  return name.trim().charAt(0).toUpperCase()
}

export default function ProfilePage() {
  const supabase = createClient()

  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .single()

    if (data) {
      setName(data.display_name ?? '')
      setAvatarUrl(data.avatar_url ?? '')
      setPreviewUrl(data.avatar_url ?? '')
    }
  }

  async function handleUpload(file: File) {
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

  async function handleSave() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: name,
        avatar_url: avatarUrl,
      })
      .eq('id', user.id)

    setLoading(false)

    if (error) {
      alert('保存失敗')
    } else {
      alert('保存しました')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-12">
      <div>
        <p className="text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
          Profile
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
          プロフィール設定
        </h1>
      </div>

      <div className="soft-card rounded-[1.8rem] p-6 md:p-8 space-y-8">
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
          <p className="text-sm text-white/60">名前</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl bg-black/20 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <p className="text-sm text-white/60">アイコンURL</p>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="mt-2 w-full rounded-2xl bg-black/20 px-4 py-3 outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary w-full rounded-2xl py-3 text-sm font-semibold"
        >
          {loading ? '保存中...' : '保存する'}
        </button>
      </div>
    </div>
  )
}