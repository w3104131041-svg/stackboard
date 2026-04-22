import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = {
  params: Promise<{ id: string }>
}

export async function POST(_request: Request, { params }: Params) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const admin = createAdminClient()

    const { error } = await admin
      .from('event_participants')
      .upsert(
        [
          {
            event_id: id,
            user_id: user.id,
          },
        ],
        { onConflict: 'event_id,user_id' }
      )

    if (error) {
      console.error('Join error:', error)
      return NextResponse.json(
        { error: error.message || '参加登録に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Join route error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'サーバーエラーが発生しました',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const admin = createAdminClient()

    const { error } = await admin
      .from('event_participants')
      .delete()
      .eq('event_id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Cancel join error:', error)
      return NextResponse.json(
        { error: error.message || '参加取消に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete join route error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'サーバーエラーが発生しました',
      },
      { status: 500 }
    )
  }
}