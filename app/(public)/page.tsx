import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 未ログイン → ログイン画面
  if (!user || error) {
    redirect('/login')
  }

  // ログイン済み → マイページ
  redirect('/me')
}