import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const { results } = body

    if (!id) {
      return NextResponse.json({ error: 'event id がありません' }, { status: 400 })
    }

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: '結果データがありません' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const rows = results.map((row: any) => ({
      event_id: id,
      user_id: row.user_id,
      place: 0,
      buy_in_total: 0,
      cash_out: 0,
      profit: Number(row.profit) || 0,
      memo: row.memo || null,
      is_confirmed: true,
      confirmed_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('results')
      .upsert(rows, { onConflict: 'event_id,user_id' })

    if (error) {
      console.error('Supabase results upsert error:', error)
      return NextResponse.json(
        { error: error.message || '結果の保存に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Results route error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'サーバーエラーが発生しました',
      },
      { status: 500 }
    )
  }
}