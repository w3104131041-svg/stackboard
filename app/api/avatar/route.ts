import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: '画像ファイルがありません' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'jpg / png / webp のみアップロードできます' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const filePath = `${user.id}/avatar-${Date.now()}.${ext}`

    const admin = createAdminClient()

    const { error: uploadError } = await admin.storage
      .from('avatars')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: uploadError.message || '画像アップロードに失敗しました' },
        { status: 500 }
      )
    }

    const {
      data: { publicUrl },
    } = admin.storage.from('avatars').getPublicUrl(filePath)

    const { error: profileError } = await admin
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (profileError) {
      console.error('Profile update error:', profileError)
      return NextResponse.json(
        { error: profileError.message || 'プロフィール更新に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, avatar_url: publicUrl })
  } catch (error) {
    console.error('Avatar route error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'サーバーエラーが発生しました',
      },
      { status: 500 }
    )
  }
}