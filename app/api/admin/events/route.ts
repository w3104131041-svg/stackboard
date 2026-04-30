import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { sendLineMessage } from '@/lib/line'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const body = await request.json()

    const event_date = body.event_date?.trim() || ''
    const start_time = body.start_time?.trim() || ''

    if (!event_date || !start_time) {
      return NextResponse.json(
        { error: '開催日と開催時間は必須です' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    const insertData = {
      title: body.title?.trim() || '無題の開催',
      event_date,
      start_time,
      venue_name: body.venue_name?.trim() || '未設定',
      venue_address: body.venue_address?.trim() || null,
      buy_in: Number(body.buy_in) || 0,
      status: body.status?.trim() || 'open',
      rebuy_rule: body.rebuy_rule?.trim() || null,
      note: body.note?.trim() || null,
      created_by: user.id,
    }

    const { data, error } = await admin
      .from('events')
      .insert([insertData])
      .select('id')
      .single()

    if (error) {
      console.error('Create event error:', error)
      return NextResponse.json(
        { error: error.message || '開催の保存に失敗しました' },
        { status: 500 }
      )
    }

    await sendLineMessage(
      `🃏 新しい開催が登録されました\n\n` +
        `開催名: ${insertData.title}\n` +
        `日付: ${insertData.event_date}\n` +
        `時間: ${insertData.start_time}\n` +
        `会場: ${insertData.venue_name}\n` +
        `参加費: ${insertData.buy_in.toLocaleString()}pt\n\n` +
        `▼詳細\n` +
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://stackboard-seven.vercel.app'}/events/${data.id}`
    )

    return NextResponse.json({ ok: true, id: data.id })
  } catch (error) {
    console.error('Create event route error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'サーバーエラーが発生しました',
      },
      { status: 500 }
    )
  }
}