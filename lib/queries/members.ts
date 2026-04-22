import { createClient } from '@/lib/supabase/server'

export async function getMembers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, email')
    .eq('is_active', true)
    .order('display_name', { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return data ?? []
}