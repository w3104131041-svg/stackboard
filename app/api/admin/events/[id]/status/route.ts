import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const status = body.status

    if (!['open', 'closed', 'finished', 'draft'].includes(status)) {
      return NextResponse.json(
        { error: '不正なステータスです' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: '管理者のみ操作できます' }, { status: 403 })
    }

    const admin = createAdminClient()

    const { error } = await admin
      .from('events')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error(error)
      return NextResponse.json(
        { error: 'ステータス更新に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}