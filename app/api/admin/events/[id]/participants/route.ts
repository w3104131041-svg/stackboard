import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const { user_ids } = body

    if (!id) {
      return NextResponse.json({ error: 'event id がありません' }, { status: 400 })
    }

    if (!Array.isArray(user_ids) || user_ids.length === 0) {
      return NextResponse.json({ error: '参加者を選択してください' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const rows = user_ids.map((userId: string) => ({
      event_id: id,
      user_id: userId,
    }))

    const { error } = await supabase
      .from('event_participants')
      .upsert(rows, { onConflict: 'event_id,user_id' })

    if (error) {
      console.error('Supabase participants upsert error:', error)
      return NextResponse.json(
        { error: error.message || '参加者の保存に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Participants route error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'サーバーエラーが発生しました',
      },
      { status: 500 }
    )
  }
}